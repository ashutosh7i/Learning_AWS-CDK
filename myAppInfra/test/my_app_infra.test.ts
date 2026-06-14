import * as cdk from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import { WhatsappSendStack } from '../lib/stacks/whatsapp-send/whatsapp-send-stack';

test('WhatsappSendStack creates SQS, Lambda, alarm, and event source mapping', () => {
  const app = new cdk.App();
  const stack = new WhatsappSendStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::SQS::Queue', 2);
  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 1);
  template.resourceCountIs('AWS::Lambda::EventSourceMapping', 1);
});
