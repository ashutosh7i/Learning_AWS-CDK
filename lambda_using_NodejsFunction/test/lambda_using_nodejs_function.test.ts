import * as cdk from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaUsingNodejsFunctionStack } from '../lib/lambda_using_nodejs_function-stack';

test('LambdaUsingNodejsFunctionStack creates a bundled Lambda function', () => {
  const app = new cdk.App();
  const stack = new LambdaUsingNodejsFunctionStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
  });
});
