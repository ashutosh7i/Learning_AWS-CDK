import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// importing lambda
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // creating a lambda function
    const myLambdaFunction = new lambda.Function(this, "HelloWorldLambda", {
      functionName: "HelloWorldLambda",
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            body: JSON.stringify('Hello World from lambda!'),
          };
        };`)
    })

     // Define the Lambda function URL resource
     // Lambda function URL is defined without authentication. When deployed, this creates a publicly accessible endpoint that can be used to invoke your function.
     // Delete this after test, do not use in Prod.
    const myFunctionUrl = myLambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    // Define a CloudFormation output for your URL
    // To output the value of this URL at deployment, we create an AWS CloudFormation output using the CfnOutput construct.
    new cdk.CfnOutput(this, "myFunctionUrlOutput", {
      value: myFunctionUrl.url,
    })
  }
}
