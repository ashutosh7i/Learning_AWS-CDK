import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
//
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as eventSources from "aws-cdk-lib/aws-lambda-event-sources";
//
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

// So normally in the processing system, SQS contains all of the jobs to be accepted by the processing lambda function. If the job is successful, the lambda does its job and everything is fine. In case the lambda fails to do the job for any reason like API failure or any internal reason, then the job is sent to a DLQ, which is a dead Q.
// This Q contains all of the failed jobs to be processed later now, ideally in a healthy system, the DLQ should be zero, but if jobs start failing the number of jobs in DLQ will start to increase
// Now we want to make sure that our systems are always healthy, and for that we want to watch the DLQ always for any failing jobs to do this. We set up AWS cloud watch alarm
// Cloud service watches the DLQ continuously and will trigger the alarm condition when the number of jobs in DLQ is increasing. Now the developers can come to the AWS console in know what's going on. The other way would be to get notified by users in case of failure.

export class SqsDlqAlarmStack extends cdk.Stack {
 
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DLQ, to retry failed jobs
    const dlqQueue = new sqs.Queue(this, 'SqsDlqAlarmDLQ', {
      queueName: "SqsDlqAlarmDLQ",
    });

    // 2. Primary queue, the entrypoint to this job processing system
    const primaryQueue = new sqs.Queue(this, 'SqsDlqAlarmPrimaryQueue', {
      queueName: "SqsDlqAlarmPrimaryQueue",
      deadLetterQueue: {
        queue: dlqQueue,
        maxReceiveCount: 3
      }
    });

    // 3. Job processing lambda function
     const processingLambda = new lambda.Function(this, "SqsDlqAlarmLambdaFunction", {
      functionName: "SqsDlqAlarmLambdaFunctionFunction",
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "index.handler",
       code: lambda.Code.fromInline(`
        // this lambda function intentionally fails to process the job to test the DLQ alarm
        exports.handler = async function(event) {
          throw new Error('Test error');
        };`)
    })

    // 4. add a event source mapping to the lambda function
    processingLambda.addEventSource(
      new eventSources.SqsEventSource(primaryQueue,{
        batchSize: 5,
      })
    )

    // 5. create a cloud watch alarm for the DLQ
    const dlqAlarm = new cloudwatch.Alarm(this, 'SqsDlqAlarm', {
      alarmName: "SqsDlqAlarm",
      alarmDescription: "Alarm for the DLQ",
      metric: dlqQueue.metricApproximateNumberOfMessagesVisible(), // the metric to watch for the alarm
      evaluationPeriods: 1, // the number of periods to evaluate the threshold for the alarm
      threshold: 1 // if the number of messages in DLQ is greater than 1, the alarm will be triggered
    });
  }
}
