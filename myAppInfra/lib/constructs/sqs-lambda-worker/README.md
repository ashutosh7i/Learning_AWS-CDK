# SqsLambdaWorker

Reusable custom construct: **primary SQS queue → Lambda processor → DLQ → CloudWatch alarm**.

Use this inside a stack (one instance per microservice). Pass only `name` and `lambdaCodePath` if defaults are fine — the DLQ, alarm, and other settings are still created automatically.

## What gets created

| Resource | AWS name pattern | Notes |
|----------|------------------|--------|
| Primary queue | `{name}-queue` | Jobs are published here |
| DLQ | `{name}-dlq` | Failed messages after retries |
| Lambda | `{name}-processor` | Triggered by primary queue |
| CloudWatch alarm | `{name}-dlq-alarm` | Fires when DLQ has messages |

The primary queue is configured with a **redrive policy**: after `maxReceiveCount` failed processing attempts (default **3**), the message moves to the DLQ.

## Usage

```typescript
import * as path from 'path';
import { SqsLambdaWorker } from '../../constructs/sqs-lambda-worker';

const worker = new SqsLambdaWorker(this, 'Worker', {
  name: 'whatsapp-send',
  lambdaCodePath: path.join(__dirname, 'lambda'),
});

// Optional: expose queue URLs in stack outputs
new cdk.CfnOutput(this, 'QueueUrl', { value: worker.queue.queueUrl });
new cdk.CfnOutput(this, 'DlqUrl', { value: worker.dlq.queueUrl });
```

## Props

| Prop | Required | Default | Description |
|------|----------|---------|-------------|
| `name` | yes | — | Prefix for queue, Lambda, and alarm names |
| `lambdaCodePath` | yes | — | Folder passed to `lambda.Code.fromAsset()` (handler + `node_modules`) |
| `maxReceiveCount` | no | `3` | Receive attempts before message goes to DLQ |
| `batchSize` | no | `1` | SQS messages per Lambda invocation |
| `alarmThreshold` | no | `1` | DLQ visible message count that triggers alarm |
| `evaluationPeriods` | no | `1` | CloudWatch evaluation periods for alarm |
| `runtime` | no | `NODEJS_24_X` | Lambda runtime |

## Lambda folder

Each stack should keep handler code next to the stack file, e.g. `lib/stacks/whatsapp-send/lambda/`. If the handler uses npm packages:

```bash
cd lib/stacks/<service>/lambda && npm install
```

Run that before `cdk deploy` so `node_modules` is included in the asset zip.

## Verify deployment (AWS CLI)

```bash
aws sqs list-queues --queue-name-prefix whatsapp-send --region ap-south-1

aws sqs get-queue-attributes \
  --queue-url "<primary-queue-url>" \
  --attribute-names RedrivePolicy \
  --region ap-south-1
```

You should see both `{name}-queue` and `{name}-dlq`, with `RedrivePolicy` pointing at the DLQ ARN.
