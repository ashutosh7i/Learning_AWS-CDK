#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { WhatsappSendStack } from '../lib/stacks/whatsapp-send/whatsapp-send-stack';

const app = new cdk.App();
new WhatsappSendStack(app, 'WhatsappSendStack', {
  env: { account: '160056257874', region: 'ap-south-1' },
});
