import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as path from 'path';
import { SqsLambdaWorker } from '../../constructs/sqs-lambda-worker';

export class WhatsappSendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Optional props (maxReceiveCount, batchSize, alarm, etc.) use SqsLambdaWorker defaults.
    // DLQ is always created — see worker.dlq and stack outputs below.
    const worker = new SqsLambdaWorker(this, 'Worker', {
      name: 'whatsapp-send',
      lambdaCodePath: path.join(__dirname, 'lambda'),
    });

    new cdk.CfnOutput(this, 'QueueUrl', {
      value: worker.queue.queueUrl,
      description: 'Primary SQS queue URL for whatsapp-send jobs',
    });

    new cdk.CfnOutput(this, 'DlqUrl', {
      value: worker.dlq.queueUrl,
      description: 'DLQ URL — failed messages land here after maxReceiveCount retries',
    });
  }
}
