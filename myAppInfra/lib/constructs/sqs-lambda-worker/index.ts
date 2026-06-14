import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';

/**
 * Configuration for {@link SqsLambdaWorker}.
 *
 * Only `name` and `lambdaCodePath` are required. All other props have defaults
 * inside the construct — omitting them still creates a DLQ, redrive policy, and alarm.
 */
export interface SqsLambdaWorkerProps {
  /** Prefix for AWS resource names: `{name}-queue`, `{name}-dlq`, `{name}-processor`, `{name}-dlq-alarm`. */
  name: string;

  /**
   * Absolute or relative path to the Lambda asset directory.
   * Must contain the handler file (default: `index.handler`) and, if used, `node_modules`.
   */
  lambdaCodePath: string;

  /**
   * How many times SQS delivers a message to Lambda before sending it to the DLQ.
   * @default 3
   */
  maxReceiveCount?: number;

  /**
   * Number of SQS messages bundled into one Lambda invocation.
   * @default 1
   */
  batchSize?: number;

  /**
   * CloudWatch alarm threshold on DLQ `ApproximateNumberOfMessagesVisible`.
   * Alarm state triggers when visible messages are >= this value.
   * @default 1
   */
  alarmThreshold?: number;

  /**
   * Number of consecutive periods the threshold must be breached before alarming.
   * @default 1
   */
  evaluationPeriods?: number;

  /**
   * Lambda runtime for the processor function.
   * @default lambda.Runtime.NODEJS_24_X
   */
  runtime?: lambda.Runtime;
}

/**
 * SQS-backed async job worker: primary queue, DLQ, Lambda event source, and DLQ alarm.
 *
 * Always provisions a DLQ and attaches it to the primary queue via a redrive policy,
 * even when optional props are omitted.
 */
export class SqsLambdaWorker extends Construct {
  /** Primary queue — publish jobs here. */
  public readonly queue: sqs.Queue;

  /** Dead-letter queue — receives messages after repeated processing failures. */
  public readonly dlq: sqs.Queue;

  /** Lambda function that processes messages from {@link queue}. */
  public readonly processor: lambda.Function;

  /** Alarm that watches {@link dlq} for visible messages. */
  public readonly alarm: cloudwatch.Alarm;

  constructor(scope: Construct, id: string, props: SqsLambdaWorkerProps) {
    super(scope, id);

    const maxReceiveCount = props.maxReceiveCount ?? 3;
    const batchSize = props.batchSize ?? 1;
    const alarmThreshold = props.alarmThreshold ?? 1;
    const evaluationPeriods = props.evaluationPeriods ?? 1;
    const runtime = props.runtime ?? lambda.Runtime.NODEJS_24_X;

    this.dlq = new sqs.Queue(this, 'DLQ', {
      queueName: `${props.name}-dlq`,
    });

    this.queue = new sqs.Queue(this, 'Queue', {
      queueName: `${props.name}-queue`,
      deadLetterQueue: {
        queue: this.dlq,
        maxReceiveCount,
      },
    });

    this.processor = new lambda.Function(this, 'Processor', {
      functionName: `${props.name}-processor`,
      runtime,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(props.lambdaCodePath),
    });

    this.processor.addEventSource(
      new eventSources.SqsEventSource(this.queue, {
        batchSize,
      }),
    );

    this.alarm = new cloudwatch.Alarm(this, 'DlqAlarm', {
      alarmName: `${props.name}-dlq-alarm`,
      alarmDescription: `Alarm when messages appear on ${props.name} DLQ`,
      metric: this.dlq.metricApproximateNumberOfMessagesVisible(),
      evaluationPeriods,
      threshold: alarmThreshold,
    });
  }
}
