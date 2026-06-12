# Learning_AWS-CDK
aws CDK is a way to describe infrastructure as code and provision infra using CLI instead of aws console, CDK compiles to native cloud formation templates.

## AWS CDK has few important components, they are-
1. Constructs
2. Stacks
3. Apps

### Constructs
A construct is a defination of services via code, it is a smallest unit for a aws service, a construct represents an aws service or pattern.
AWS CDK constructs are organized into three levels of abstraction i.e. L1, L2, and L3; which define how infrastructure is provisioned, ranging from direct CloudFormation mapping to pre-configured architectural patterns. They are designed to simplify cloud development by encapsulating boilerplate code, increasing in abstraction level from L1 to L3.

a. Level 1 (L1) - Low-Level Constructs (CFN Resources)
  - Description: These are the lowest-level constructs, directly mapped 1:1 to AWS CloudFormation resources. They are automatically generated from CloudFormation specifications.
  - Characteristics: Known by the Cfn prefix (e.g., CfnBucket), they require configuring every property manually.
  - Use Case: When you need to access new AWS features or resources not yet covered by L2/L3 abstractions.
    
b. Level 2 (L2) - Mid-Level Constructs (Curated Constructs)
  - Description: These represent AWS resources with higher-level, intent-based APIs and sensible defaults.
  - Characteristics: They offer convenient defaults, boilerplate reduction, and built-in methods for IAM permissions (e.g., grantRead).
  - Use Case: The standard choice for most infrastructure needs (e.g., s3.Bucket), balancing control and convenience.
    
c. Level 3 (L3) - High-Level Constructs (Patterns)
  - Description: These are "patterns" designed to solve common, complex, multi-resource architectural scenarios, such as creating a VPC with auto-scaling ECS services.
  - Characteristics: Highly opinionated, they bundle multiple resources into a single component to simplify deployment, such as aws-apigateway.LambdaRestApi.
  - Use Case: Rapidly deploying full, pre-configured architectural solutions.

### Stacks
A Stack represents a single CloudFormation template. All resources defined within a stack are provisioned, updated, or deleted as a single unit.
  - Purpose: To logically group related resources that should be deployed together.
  - Independent Scaling: Because stacks are independent deployment units, you can use the CDK CLI to deploy one stack (e.g., cdk deploy MyBackendStack) without affecting others in the same app.

### Apps
The App is the entry point of your CDK program. It doesn't create AWS resources on its own; instead, it provides the necessary execution context to manage your stacks.
  - Purpose: Orchestrates the deployment of multiple stacks and allows them to share resources with each other.
  - Example: If you have a separate "Frontend" stack and "Backend" stack, they would both live inside the same App

> a very userful command is cdk help

## An interesting image explaining CDK-

![CDK Architecture](https://docs.aws.amazon.com/images/cdk/v2/guide/images/AppStacks.png)

## Getting Started
### Requirements
- nodejs
- typescript
- aws cli `aws --version`
- aws cdk - `cdk --version` - `$ npm install -g aws-cdk`

### Steps
1. initialize a new project.
  `$ cdk init app --language typescript`
it creates a new project,
```
# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.     

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
```
the lib folder contains stacks, we can have more than one stack in project.
the bin folder contains app, a project can only have one app.

2. We usually write code in lib folder, for more configurations we edit the .ts file in bin folder, for example to specify the region and account we want to deploy to, we can edit the .ts file in bin folder.

3. Now we write code in that lib folder, creating a lambda function. 
Let’s take a closer look at the Function construct. Like all constructs, the Function class takes three parameters:

- scope – Defines your Stack instance as the parent of the Function construct. All constructs that define AWS resources are created within the scope of a stack. We can define constructs inside of constructs, creating a hierarchy (tree). Here, and in most cases, the scope is *this*.

- Id – The construct ID of the Function within your AWS CDK app. This ID, plus a hash based on the function’s location within the stack, uniquely identifies the function during deployment. The AWS CDK also references this ID when you update the construct in your app and re-deploy to update the deployed resource. Here, we have construct ID HelloWorldLambda. 

- Props – A bundle of values that define properties of the function. Here we define the runtime, handler, and code properties.
Props are represented differently in the languages supported by the AWS CDK. In TypeScript and JavaScript, props is a single argument and we pass in an object containing the desired properties.

For lambda, required props were runtime, handler and code.
Functions can also have a name, specified with the functionName property. This is different from the construct ID.

4. Bootstrap your AWS environment
In this step, we bootstrap the AWS environment, This prepares environment for CDK deployments.
```
# hello_world % cdk bootstrap 
 ⏳  Bootstrapping environment aws://123123123456/ap-south-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
 ✅  Environment aws://123123123456/ap-south-1 bootstrapped (no changes).
```

5. Build your CDK app
`npm run build`
this compiles the ts and outputs js and ts declaration file

6. List the CDK stacks in your app
At this point, you should have a CDK app containing a single CDK stack. To verify, use the CDK CLI `cdk list` command to display your stacks. The output should display a single stack named HelloWorldStack.

7. Synthesize a CloudFormation template

In this step, you prepare for deployment by synthesizing a CloudFormation template with the CDK CLI cdk synth command. This command performs basic validation of your CDK code, runs your CDK app, and generates a CloudFormation template from your CDK stack.
If you don’t synthesize a template, the CDK CLI will automatically perform this step when you deploy. However, it is recommend that you run this step before each deployment to check for synthesis errors.

8. Deploy your CDK stack

We use the CDK CLI `cdk deploy` command to deploy your CDK stack. This command retrieves your generated CloudFormation template and deploys it through AWS CloudFormation, which provisions your resources as part of a CloudFormation stack.

```
$ hello_world % cdk deploy

✨  Synthesis time: 1.37s

HelloWorldStack: start: Building HelloWorldStack Template
HelloWorldStack: success: Built HelloWorldStack Template
HelloWorldStack: start: Publishing HelloWorldStack Template (123123123456-ap-south-1-123dataiswrong)
HelloWorldStack: success: Published HelloWorldStack Template (123123123456-ap-south-1-123dataiswrong)
HelloWorldStack: creating CloudFormation changeset...
Changeset arn:aws:cloudformation:ap-south-1:123123123456:changeSet/cdk-deploy-change-set/test created and waiting in review for manual execution (--no-execute)
Stack HelloWorldStack
IAM Statement Changes
┌───┬─────────────────────────────────────┬────────┬──────────────────────────┬──────────────────────────────┬───────────┐
│   │ Resource                            │ Effect │ Action                   │ Principal                    │ Condition │
├───┼─────────────────────────────────────┼────────┼──────────────────────────┼──────────────────────────────┼───────────┤
│ + │ ${HelloWorldLambda.Arn}             │ Allow  │ lambda:InvokeFunctionUrl │ *                            │           │
│ + │ ${HelloWorldLambda.Arn}             │ Allow  │ lambda:InvokeFunction    │ *                            │           │
├───┼─────────────────────────────────────┼────────┼──────────────────────────┼──────────────────────────────┼───────────┤
│ + │ ${HelloWorldLambda/ServiceRole.Arn} │ Allow  │ sts:AssumeRole           │ Service:lambda.amazonaws.com │           │
└───┴─────────────────────────────────────┴────────┴──────────────────────────┴──────────────────────────────┴───────────┘
IAM Policy Changes
┌───┬─────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource                        │ Managed Policy ARN                                                             │
├───┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${HelloWorldLambda/ServiceRole} │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole │
└───┴─────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)


"--require-approval" is enabled and stack includes security-sensitive updates: Do you wish to deploy these changes? (y/n) y
HelloWorldStack: deploying... [1/1]

 ✅  HelloWorldStack

✨  Deployment time: 43.99s

Outputs:
HelloWorldStack.myFunctionUrlOutput = https://m0aqyzw.lambda-url.ap-south-1.on.aws/
Stack ARN:
arn:aws:cloudformation:ap-south-1:123123123456:stack/HelloWorldStack/90794390-6634-1111-b41a-02e460a1f186

✨  Total time: 45.36s

```

9. your code changes have not made any direct updates to your deployed Lambda resource. Your code defines the desired state of your resource. To modify your deployed resource, you will use the CDK CLI to synthesize the desired state into a new AWS CloudFormation template. Then, you will deploy your new CloudFormation template as a change set. Change sets make only the necessary changes to reach your new desired state.

To preview your changes, run the cdk diff command. The following is an example:

```
$ hello_world % cdk diff  
start: Building HelloWorldStack Template
success: Built HelloWorldStack Template
start: Publishing HelloWorldStack Template (123dataiswrong-ap-south-1-6b21461f)
success: Published HelloWorldStack Template (123dataiswrong-ap-south-1-6b21461f)
Hold on while we create a read-only change set to get a diff with accurate replacement information (use --method=template to use a less accurate but faster template-only diff)

Stack HelloWorldStack
Resources
[~] AWS::Lambda::Function HelloWorldLambda HelloWorldLambda5A02458E
 └─ [~] Code
     └─ [~] .ZipFile:
         ├─ [-] 
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            body: JSON.stringify('Hello World!'),
          };
        };
         └─ [+] 
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            body: JSON.stringify('Hello World from lambda!'),
          };
        };



✨  Number of stacks with differences: 1
```

10. Delete your application, Use the CDK CLI cdk destroy command to delete your application. This command deletes the CloudFormation stack associated with your CDK stack, which includes the resources you created.

