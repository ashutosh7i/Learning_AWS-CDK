# lambda_using_NodejsFunction

Simple Lambda using [`NodejsFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html) — no explicit `runtime` or `handler`.

Handler source lives in `lib/` next to the stack:

```
lib/
├── handler.ts
└── lambda_using_nodejs_function-stack.ts
```

## Commands

```bash
npm install
npm run build
npm test
npx cdk synth
npx cdk deploy
```

Requires `esbuild` (dev dependency) for bundling.
