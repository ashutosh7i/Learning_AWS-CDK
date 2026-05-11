# Learning_AWS-CDK
aws CDK is a way to describe infrastructure as code and provision infra using CLI instead of aws console, CDK compiles to native cloud formation templates.

## AWS CDK has few important components, they are-
1. Constructs
2. Stacks
3. Apps

### Constructs
A construct is a defination of services via code, it is a smallest unit for a aws service, a construct represents an aws service or pattern.
AWS CDK constructs are organized into three levels of abstraction i.e. L1, L2, and L3; which define how infrastructure is provisioned, ranging from direct CloudFormation mapping to pre-configured architectural patterns. They are designed to simplify cloud development by encapsulating boilerplate code, increasing in abstraction level from L1 to L3.

1. Level 1 (L1) - Low-Level Constructs (CFN Resources)
  Description: These are the lowest-level constructs, directly mapped 1:1 to AWS CloudFormation resources. They are automatically generated from CloudFormation specifications.
  Characteristics: Known by the Cfn prefix (e.g., CfnBucket), they require configuring every property manually.
  Use Case: When you need to access new AWS features or resources not yet covered by L2/L3 abstractions.
2. Level 2 (L2) - Mid-Level Constructs (Curated Constructs)
  Description: These represent AWS resources with higher-level, intent-based APIs and sensible defaults.
  Characteristics: They offer convenient defaults, boilerplate reduction, and built-in methods for IAM permissions (e.g., grantRead).
  Use Case: The standard choice for most infrastructure needs (e.g., s3.Bucket), balancing control and convenience.
3. Level 3 (L3) - High-Level Constructs (Patterns)
  Description: These are "patterns" designed to solve common, complex, multi-resource architectural scenarios, such as creating a VPC with auto-scaling ECS services.
  Characteristics: Highly opinionated, they bundle multiple resources into a single component to simplify deployment, such as aws-apigateway.LambdaRestApi.
  Use Case: Rapidly deploying full, pre-configured architectural solutions.

### Stacks
A Stack represents a single CloudFormation template. All resources defined within a stack are provisioned, updated, or deleted as a single unit.
  Purpose: To logically group related resources that should be deployed together.
  Independent Scaling: Because stacks are independent deployment units, you can use the CDK CLI to deploy one stack (e.g., cdk deploy MyBackendStack) without affecting others in the same app.

### Apps
The App is the entry point of your CDK program. It doesn't create AWS resources on its own; instead, it provides the necessary execution context to manage your stacks.
  Purpose: Orchestrates the deployment of multiple stacks and allows them to share resources with each other.
  Example: If you have a separate "Frontend" stack and "Backend" stack, they would both live inside the same App
