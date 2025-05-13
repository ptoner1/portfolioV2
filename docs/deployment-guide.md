# Portfolio Application Deployment Guide

This guide provides detailed instructions for deploying the portfolio application to AWS, covering both the frontend and backend services.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Frontend Deployment with AWS Amplify](#frontend-deployment-with-aws-amplify)
- [Backend Deployment with AWS Lambda](#backend-deployment-with-aws-lambda)
- [Environment Variables Management](#environment-variables-management)
- [Domain Configuration and SSL Setup](#domain-configuration-and-ssl-setup)
- [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)

## Architecture Overview

The portfolio application uses a modern serverless architecture:

```
+------------------------+     +---------------------+     +-------------------+
|                        |     |                     |     |                   |
|  Frontend (React/TS)   |---->|  API Gateway        |---->| Lambda Function   |
|  Hosted on AWS Amplify |     |                     |     |                   |
|                        |     +---------------------+     +-------------------+
+------------------------+                                      |        |
                                                              |        |
                                                 +------------+        +------------+
                                                 |                                  |
                                       +---------v--------+             +-----------v-------+
                                       |                  |             |                   |
                                       |  AWS SES         |             |  AWS SNS          |
                                       |  (Email Service) |             |  (SMS Service)    |
                                       |                  |             |                   |
                                       +------------------+             +-------------------+
```

## Frontend Deployment with AWS Amplify

AWS Amplify provides a streamlined CI/CD workflow for frontend deployment.

### Initial Setup

1. **Create an Amplify App**:

   - Log into the AWS Console and navigate to Amplify
   - Click "Create app" → "Host web app"
   - Connect to your Git provider (GitHub, GitLab, Bitbucket)
   - Select the repository and branch to deploy

2. **Configure Build Settings**:

   Update the build settings with the following configuration:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**:

   Add the following environment variables in the Amplify Console under "Environment variables":

   - `VITE_API_URL` - URL of your deployed API Gateway (e.g., `https://api.yourdomain.com`)
   - Any other frontend environment variables your application needs

### Handling Module Federation

If you're using remote federated modules, ensure those are deployed and accessible at the URLs specified in your Vite config:

1. **Update Production URLs**:

   Before deployment, update the `vite.config.ts` file to point to the production URLs of your federated modules:

   ```typescript
   federation({
     name: 'portfolio-app',
     remotes: {
       spotifyProject: 'https://your-deployed-module.com/assets/remoteEntry.js',
     },
     // ...
   })
   ```

2. **Cross-Origin Considerations**:

   Ensure your remote modules allow CORS from your main application domain.

### Custom Domain Setup

1. **Add Your Domain**:

   - In Amplify Console, go to "Domain management"
   - Click "Add domain"
   - Enter your domain name and click "Configure domain"

2. **Configure DNS**:

   - Add the CNAME records provided by Amplify to your DNS provider
   - Wait for DNS propagation (up to 48 hours)

3. **SSL Certificate**:

   AWS Amplify automatically provisions and renews SSL certificates for custom domains.

## Backend Deployment with AWS Lambda

The backend is deployed as a serverless application using AWS Lambda, API Gateway, SES, and SNS.

### Prerequisites

- AWS CLI installed and configured
- AWS SAM CLI (optional, for local testing)
- Proper IAM permissions to deploy Lambda, API Gateway, SES, and SNS

### Deployment Steps

#### Option 1: Using AWS CloudFormation (Recommended)

1. **Configure the CloudFormation Template**:

   The project includes a CloudFormation template (`server/aws/cloudformation-template.yaml`) which defines all required resources.

2. **Prepare the Lambda Code**:

   ```bash
   cd server
   # Install production dependencies
   npm ci --production
   # Create a deployment package
   zip -r contactLambda.zip contactLambda.js node_modules
   ```

3. **Create an S3 Bucket for Lambda Code**:

   ```bash
   aws s3 mb s3://your-env-portfolio-lambda-code
   # Upload the zip file to S3
   aws s3 cp contactLambda.zip s3://your-env-portfolio-lambda-code/
   ```

4. **Deploy using CloudFormation**:

   ```bash
   aws cloudformation deploy \
     --template-file aws/cloudformation-template.yaml \
     --stack-name portfolio-contact-stack \
     --parameter-overrides \
       RecipientEmail=your@email.com \
       RecipientPhone=1234567890 \
       Environment=prod \
     --capabilities CAPABILITY_IAM
   ```

5. **Get the API Gateway Endpoint**:

   ```bash
   aws cloudformation describe-stacks \
     --stack-name portfolio-contact-stack \
     --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
     --output text
   ```

#### Option 2: Using the Deployment Script

The project includes a deployment script (`server/aws/deployLambda.js`) that handles the Lambda deployment process:

1. **Configure environment variables**:

   Ensure you have set up the required environment variables in `server/.env`.

2. **Run the deployment script**:

   ```bash
   cd server
   npm run deploy:lambda
   ```

### Configuring AWS Services

#### SES (Simple Email Service)

1. **Verify Email Identities**:

   By default, SES is in sandbox mode, which requires verifying both sender and recipient emails:

   ```bash
   aws ses verify-email-identity --email-address your@email.com
   ```

2. **Request Production Access** (optional for higher volumes):

   - Open a support ticket to move out of sandbox mode
   - Provide details on how you'll handle bounces and complaints

#### SNS (Simple Notification Service)

1. **Verify Phone Number** for SMS notifications:

   ```bash
   aws sns opt-in-phone-number --phone-number +1XXXXXXXXXX
   ```

2. **Set SMS Attributes** (optional):

   ```bash
   aws sns set-sms-attributes --attributes '{"DefaultSenderID": "Portfolio", "DefaultSMSType": "Transactional"}'
   ```

## Environment Variables Management

### Frontend Environment Variables

For Vite applications, environment variables that should be accessible to the frontend should be prefixed with `VITE_`.

1. **Local Development**:

   Create a `.env` file in the project root:

   ```
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Production**:

   Set these variables in AWS Amplify Console under "Environment variables".

### Backend Environment Variables

1. **Local Development**:

   Create a `.env` file in the `server` directory based on `.env.example`.

2. **Lambda Environment**:

   Set environment variables in the CloudFormation template or directly in the Lambda Console.

3. **Secrets Management**:

   For sensitive information, consider using AWS Secrets Manager:

   ```javascript
   // Example code to retrieve a secret
   const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
   
   const client = new SecretsManagerClient({ region: 'us-east-1' });
   const response = await client.send(
     new GetSecretValueCommand({ SecretId: 'portfolio/api-keys' })
   );
   const secrets = JSON.parse(response.SecretString);
   ```

## Domain Configuration and SSL Setup

### API Gateway Custom Domain

1. **Create an SSL Certificate**:

   ```bash
   aws acm request-certificate \
     --domain-name api.yourdomain.com \
     --validation-method DNS
   ```

2. **Add DNS Validation Records**:

   - Add the CNAME records provided by ACM to your DNS provider
   - Wait for certificate validation

3. **Create Custom Domain in API Gateway**:

   ```bash
   aws apigateway create-domain-name \
     --domain-name api.yourdomain.com \
     --regional-certificate-arn arn:aws:acm:region:account-id:certificate/certificate-id \
     --endpoint-configuration types=REGIONAL
   ```

4. **Create Base Path Mapping**:

   ```bash
   aws apigateway create-base-path-mapping \
     --domain-name api.yourdomain.com \
     --rest-api-id YOUR_API_ID \
     --stage prod
   ```

5. **Add DNS Record**:

   Create a CNAME record pointing `api.yourdomain.com` to the generated API Gateway domain.

## CI/CD Pipeline Configuration

### AWS Amplify CI/CD Pipeline

Amplify automatically sets up a CI/CD pipeline when connected to your Git repository. For advanced customization:

1. **Create an `amplify.yml` file** in your project root:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
           - npm run test -- --watchAll=false  # Run tests before building
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

2. **Branch-Specific Settings**:

   In the Amplify Console, you can configure different settings per branch (e.g., main, develop):
   
   - Environment variables
   - Build settings
   - Domain/subdomain mapping

### Lambda Deployment Pipeline

For automated Lambda deployments, consider:

1. **Using AWS CodePipeline and CodeBuild**:

   - Set up a CodeBuild project using buildspec.yml:

     ```yaml
     version: 0.2
     phases:
       install:
         runtime-versions:
           nodejs: 18
       pre_build:
         commands:
           - cd server
           - npm ci
       build:
         commands:
           - npm test
           - npm run deploy:lambda
     ```

2. **GitHub Actions Alternative**:

   Create a `.github/workflows/deploy-lambda.yml` file:

   ```yaml
   name: Deploy Lambda

   on:
     push:
       branches:
         - main
       paths:
         - 'server/**'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - name: Install dependencies
           run: cd server && npm ci
         - name: Configure AWS credentials
           uses: aws-actions/configure-aws-credentials@v1
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: us-east-1
         - name: Deploy Lambda
           run: cd server && npm run deploy:lambda
   ```

## Monitoring and Troubleshooting

### CloudWatch Logs

- Lambda logs are automatically sent to CloudWatch
- View logs in the CloudWatch Console or using the AWS CLI:

  ```bash
  aws logs get-log-events \
    --log-group-name /aws/lambda/prod-portfolio-contact-form \
    --log-stream-name $(aws logs describe-log-streams \
      --log-group-name /aws/lambda/prod-portfolio-contact-form \
      --order-by LastEventTime \
      --descending \
      --limit 1 \
      --query 'logStreams[0].logStreamName' \
      --output text)
  ```

### Testing Deployed Endpoints

Use curl or Postman to test your API:

```bash
curl -X POST \
  https://api.yourdomain.com/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message",
    "phone": "1234567890"
  }'
```

## Scaling Considerations

The serverless architecture automatically scales with demand, but consider:

- SES sending limits (especially in sandbox mode)
- SNS SMS sending limits and costs
- API Gateway throttling limits
- Lambda concurrency limits

To increase limits, contact AWS Support or adjust service quotas in the AWS Console.
