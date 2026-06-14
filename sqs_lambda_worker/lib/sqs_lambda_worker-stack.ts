import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
//
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as eventSources from "aws-cdk-lib/aws-lambda-event-sources";
//
import * as path from 'path';

export class SqsLambdaWorkerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // the idea is to create a sqs + lambda based asynchronous job processing system, We will publish new jobs to the SQS queue
    // and the lambda will be triggered by the SQS queue and process the jobs asynchronously.
    // We will also add a dead letter queue to handle failed jobs.

    // 1. DLQ, to retry failed jobs
    const dlqQueue = new sqs.Queue(this, 'SqsLambdaWorkerDLQ', {
      queueName: "SqsLambdaWorkerDLQ",
    });

    // 2. Primary queue, the entrypoint to this job processing system
    const primaryQueue = new sqs.Queue(this, 'SqsLambdaWorkerPrimaryQueue', {
      queueName: "SqsLambdaWorkerPrimaryQueue",
      deadLetterQueue: {
        queue: dlqQueue,
        maxReceiveCount: 3
      }
    });

    // 3. Job processing lambda function
     const processingLambda = new lambda.Function(this, "SqsLambdaWorkerLambda", {
      functionName: "SqsLambdaWorkerLambda",
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "index.handler",
       code: lambda.Code.fromAsset(path.resolve(process.cwd(), 'src')), // open the src folder and get the index.js file
    })

    //4. add a event source mapping to the lambda function
    processingLambda.addEventSource(
      new eventSources.SqsEventSource(primaryQueue,{
        batchSize: 5,
      })
    )
  }
}
