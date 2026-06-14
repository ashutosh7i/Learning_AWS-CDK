#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { LambdaUsingNodejsFunctionStack } from '../lib/lambda_using_nodejs_function-stack';

const app = new cdk.App();
new LambdaUsingNodejsFunctionStack(app, 'LambdaUsingNodejsFunctionStack', {
  env: { account: '160056257874', region: 'ap-south-1' },
});
