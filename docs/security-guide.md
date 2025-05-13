# Portfolio Application Security Guide

This guide outlines security best practices for the portfolio application, covering AWS IAM configurations, API security, frontend security, and environment variable management.

## Table of Contents

- [AWS IAM Best Practices](#aws-iam-best-practices)
- [API Security Recommendations](#api-security-recommendations)
- [Frontend Security Best Practices](#frontend-security-best-practices)
- [Environment Variable Management](#environment-variable-management)
- [Data Protection](#data-protection)
- [Security Monitoring and Auditing](#security-monitoring-and-auditing)

## AWS IAM Best Practices

The portfolio application uses several AWS services, each requiring proper IAM configuration to maintain security.

### Principle of Least Privilege

1. **Lambda Function Roles**:

   The `ContactFormLambdaRole` should have only the exact permissions needed:

   ```yaml
   # Good example from cloudformation-template.yaml
   Policies:
     - PolicyName: !Sub "${Environment}-contact-form-lambda-policy"
       PolicyDocument:
         Version: '2012-10-17'
         Statement:
           - Effect: Allow
             Action:
               - 'ses:SendEmail'
               - 'ses:SendRawEmail'
             Resource: '*'  # Ideally, restrict to specific ARNs
           - Effect: Allow
             Action:
               - 'sns:Publish'
             Resource: '*'  # Ideally, restrict to specific ARNs
   ```

   To improve this further, restrict resources to specific ARNs:

   ```yaml
   # Better example
   - Effect: Allow
     Action:
       - 'ses:SendEmail'
       - 'ses:SendRawEmail'
     Resource: !Sub "arn:aws:ses:${AWS::Region}:${AWS::AccountId}:identity/${RecipientEmail}"
   ```

2. **Creating Service-Specific Roles**:

   Each service should have its own dedicated role instead of using one role for multiple services:

   - `contact-form-ses-role` - Just for SES operations
   - `contact-form-sns-role` - Just for SNS operations

### IAM Role Recommendations

1. **Use Conditions to Restrict Access**:

   ```json
   {
     "Effect": "Allow",
     "Action": "ses:SendEmail",
     "Resource": "*",
     "Condition": {
       "StringEquals": {
         "ses:FromAddress": "your@email.com"
       }
     }
   }
   ```

2. **Implement Boundary Policies**:

   For development environments, set permission boundaries:

   ```bash
   aws iam put-role-permissions-boundary \
     --role-name ContactFormLambdaRole \
     --permissions-boundary arn:aws:iam::aws:policy/boundary/DevelopmentBoundary
   ```

3. **Regularly Review and Rotate Credentials**:

   - Avoid using long-term access keys
   - Use temporary credentials with STS when possible
   - Set up a rotation schedule for any access keys you do use

### Cross-Account Access

If you're deploying to multiple AWS accounts (e.g., development, staging, production):

1. **Define External ID Requirements**:

   ```json
   {
     "Effect": "Allow",
     "Action": "sts:AssumeRole",
     "Principal": {
       "AWS": "arn:aws:iam::PRODUCTION-ACCOUNT-ID:root"
     },
     "Condition": {
       "StringEquals": {
         "sts:ExternalId": "unique-id-known-only-to-you"
       }
     }
   }
   ```

2. **Implement Role Chaining Carefully**:

   When accessing multiple accounts, be aware of the maximum session duration limitations (typically 1 hour for chained roles).

## API Security Recommendations

The application's API (through API Gateway and Lambda) should implement these security measures:

### Authentication and Authorization

1. **API Key for Public Methods** (for simple rate limiting and identification):

   ```yaml
   # In CloudFormation template
   ApiKey:
     Type: AWS::ApiGateway::ApiKey
     Properties:
       Name: !Sub "${Environment}-portfolio-api-key"
       Enabled: true
       StageKeys:
         - RestApiId: !Ref ContactFormApi
           StageName: !Ref Environment
   ```

2. **JWT Authentication for Admin Functions** (if you add them in the future):

   ```javascript
   // Example middleware for verifying JWT
   const jwt = require('jsonwebtoken');

   const verifyToken = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     
     if (!token) {
       return res.status(401).json({ message: 'No token provided' });
     }
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       return res.status(401).json({ message: 'Invalid token' });
     }
   };
   ```

### Input Validation

Your application already uses Joi for validation. Ensure all routes implement validation:

```javascript
// Example from contactSchema.js
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
  phone: Joi.string().pattern(/^[\d\s\-\.\(\)]{10,15}$/).allow('').optional()
});
```

### Rate Limiting

Implement API Gateway usage plans to prevent abuse:

```yaml
# In CloudFormation template
ApiUsagePlan:
  Type: AWS::ApiGateway::UsagePlan
  Properties:
    UsagePlanName: !Sub "${Environment}-portfolio-usage-plan"
    Description: "Usage plan for the Portfolio API"
    ApiStages:
      - ApiId: !Ref ContactFormApi
        Stage: !Ref Environment
    Throttle:
      BurstLimit: 5
      RateLimit: 2
    Quota:
      Limit: 100
      Period: DAY
```

### HTTPS Configuration

Always enforce HTTPS for all API endpoints:

1. **API Gateway Settings**:

   In the API Gateway console, ensure "Force HTTPS" is enabled.

2. **Content Security Policy** in Lambda responses:

   ```javascript
   // Add to Lambda response headers
   headers: {
     'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': 'https://your-domain.com',
     'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
   }
   ```

### API Gateway Protection

1. **Enable AWS WAF** for your API Gateway:

   ```yaml
   # In CloudFormation
   ApiWafAcl:
     Type: AWS::WAFv2::WebACL
     Properties:
       Name: !Sub "${Environment}-portfolio-api-waf"
       Scope: REGIONAL
       DefaultAction:
         Allow: {}
       Rules:
         - Name: AWSManagedRulesCommonRuleSet
           Priority: 0
           Statement:
             ManagedRuleGroupStatement:
               VendorName: AWS
               Name: AWSManagedRulesCommonRuleSet
           OverrideAction:
             None: {}
           VisibilityConfig:
             SampledRequestsEnabled: true
             CloudWatchMetricsEnabled: true
             MetricName: AWSManagedRulesCommonRuleSet
       VisibilityConfig:
         SampledRequestsEnabled: true
         CloudWatchMetricsEnabled: true
         MetricName: !Sub "${Environment}-portfolio-api-waf"
   ```

2. **Associate WAF with API Gateway**:

   ```yaml
   ApiWafAssociation:
     Type: AWS::WAFv2::WebACLAssociation
     Properties:
       ResourceArn: !Sub "arn:aws:apigateway:${AWS::Region}::/restapis/${ContactFormApi}/stages/${Environment}"
       WebACLArn: !GetAtt ApiWafAcl.Arn
   ```

## Frontend Security Best Practices

### Content Security Policy (CSP)

Add a strict CSP to the application to prevent XSS attacks:

1. **Define a CSP in `index.html`**:

   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; 
     script-src 'self' https://trusted-cdn.com; 
     style-src 'self' https://fonts.googleapis.com; 
     font-src 'self' https://fonts.gstatic.com; 
     img-src 'self' data: https://trusted-image-cdn.com; 
     connect-src 'self' https://api.yourdomain.com;">
   ```

2. **For Module Federation**, ensure you include the necessary domains:

   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; 
     script-src 'self' https://trusted-cdn.com https://your-module-domain.com; 
     ...">
   ```

### XSS Protection

React inherently helps protect against XSS, but add these additional safeguards:

1. **Sanitize User Inputs**:

   When displaying user-generated content:

   ```jsx
   import DOMPurify from 'dompurify';
   
   // When rendering user content
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userProvidedContent) }} />
   ```

2. **Using TypeScript Properly**:

   Leverage TypeScript's type system to ensure proper handling of data:

   ```tsx
   // Define clear interfaces for data
   interface ContactFormData {
     name: string;
     email: string;
     message: string;
     phone?: string;
   }
   
   // Type checking will help prevent injection
   const submitForm = (data: ContactFormData) => {
     // ...
   };
   ```

### CSRF Protection

For APIs that modify data and require authentication:

1. **Double Submit Cookie Pattern**:

   ```javascript
   // When generating a form
   const csrfToken = generateRandomToken();
   setCookie('csrf_token', csrfToken);
   
   // Include in form
   <input type="hidden" name="_csrf" value={csrfToken} />
   
   // Verify in backend
   const isValidCSRF = req.body._csrf === req.cookies.csrf_token;
   ```

### Secure Dependencies

1. **Regular Security Audits**:

   ```bash
   # Run npm audit regularly
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   ```

2. **Set Up Dependabot** for GitHub repositories:

   Create a `.github/dependabot.yml` file:

   ```yaml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
   
     - package-ecosystem: "npm"
       directory: "/server"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
   ```

### CORS Configuration

1. **Frontend CORS Headers**:

   When calling APIs, ensure proper CORS headers:

   ```typescript
   fetch('https://api.yourdomain.com/contact', {
     method: 'POST',
     credentials: 'include', // For cookies if needed
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(formData)
   });
   ```

2. **Backend CORS Configuration**:

   From your Express server configuration:

   ```javascript
   // Specific origin instead of wildcard
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? 'https://yourdomain.com' 
       : 'http://localhost:5173',
     methods: ['GET', 'POST'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true // If using cookies
   }));
   ```

## Environment Variable Management

### Securing Frontend Environment Variables

Remember that all frontend environment variables are exposed to the browser:

1. **Only Include Non-Sensitive Data**:

   ```
   # Safe for frontend
   VITE_API_URL=https://api.yourdomain.com
   VITE_APP_VERSION=1.0.0
   
   # NEVER include in frontend
   # VITE_API_SECRET=my-secret-key  # WRONG!
   ```

2. **Runtime Configuration**:

   For dynamic configuration that shouldn't be built into the bundle:

   ```javascript
   // public/config.js (fetched at runtime)
   window.APP_CONFIG = {
     apiUrl: 'https://api.yourdomain.com',
     features: {
       enableNewFeature: true
     }
   };
   ```

   Then in `index.html`:

   ```html
   <script src="%PUBLIC_URL%/config.js"></script>
   ```

### Securing Backend Environment Variables

1. **Use AWS Secrets Manager** for production:

   ```javascript
   const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
   
   const getSecrets = async () => {
     const client = new SecretsManagerClient({ region: 'us-east-1' });
     const response = await client.send(
       new GetSecretValueCommand({ SecretId: 'portfolio-secrets' })
     );
     return JSON.parse(response.SecretString);
   };
   ```

2. **Environment-Specific Variables**:

   Structure your `.env` files by environment:

   ```
   # .env.development
   API_URL=http://localhost:3001
   
   # .env.production
   API_URL=https://api.yourdomain.com
   ```

3. **Validate Environment Variables** on startup:

   ```javascript
   // In server.js or a config file
   const requiredEnvVars = [
     'RECIPIENT_EMAIL',
     'RECIPIENT_PHONE',
     'SES_REGION',
     'SNS_REGION'
   ];
   
   requiredEnvVars.forEach(varName => {
     if (!process.env[varName]) {
       console.error(`Error: Environment variable ${varName} is required but not set`);
       process.exit(1);
     }
   });
   ```

## Data Protection

### Sensitive Data Handling

1. **Encryption in Transit**:

   - Always use HTTPS (already implemented via API Gateway and CloudFront)
   - Use secure WebSockets when implementing real-time features

2. **PII Handling**:

   - Minimize collection of personal information
   - If storing contact form submissions, implement proper encryption
   - Consider implementing automatic data retention policies

3. **Error Messages**:

   Avoid exposing sensitive information in error messages:

   ```javascript
   // Bad
   app.use((err, req, res, next) => {
     res.status(500).json({ error: err.stack }); // Exposes implementation details
   });
   
   // Good
   app.use((err, req, res, next) => {
     console.error('Server error:', err);
     res.status(500).json({
       message: 'An unexpected error occurred',
       errorId: generateErrorId() // For correlation without exposure
     });
   });
   ```

### AWS Resource Protection

1. **S3 Bucket Policies** (if you add file storage):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "DenyUnencryptedObjectUploads",
         "Effect": "Deny",
         "Principal": "*",
         "Action": "s3:PutObject",
         "Resource": "arn:aws:s3:::your-bucket/*",
         "Condition": {
           "StringNotEquals": {
             "s3:x-amz-server-side-encryption": "AES256"
           }
         }
       }
     ]
   }
   ```

2. **EBS Encryption** (if using EC2):

   Enable by default in your AWS account:

   ```bash
   aws ec2 enable-ebs-encryption-by-default
   ```

## Security Monitoring and Auditing

### AWS CloudTrail

Enable CloudTrail to log all API actions:

```yaml
# CloudFormation
CloudTrail:
  Type: AWS::CloudTrail::Trail
  Properties:
    IsLogging: true
    S3BucketName: !Ref CloudTrailBucket
    CloudWatchLogsLogGroupArn: !GetAtt CloudTrailLogGroup.Arn
    CloudWatchLogsRoleArn: !GetAtt CloudTrailRole.Arn
    EventSelectors:
      - DataResources:
          - Type: AWS::S3::Object
            Values:
              - !Sub arn:aws:s3:::${S3Bucket}/
        ReadWriteType: WriteOnly
    IsMultiRegionTrail: true
```

### AWS Config

Set up AWS Config to monitor security compliance:

```yaml
# CloudFormation
ConfigRecorder:
  Type: AWS::Config::ConfigurationRecorder
  Properties:
    Name: PortfolioConfigRecorder
    RecordingGroup:
      AllSupported: true
      IncludeGlobalResourceTypes: true
    RoleARN: !GetAtt ConfigRole.Arn
```

### Security Alerts

Set up CloudWatch Alarms for suspicious activities:

```yaml
# CloudFormation
SecurityGroupChangesAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: SecurityGroupChangesAlarm
    AlarmDescription: Alarm when security groups are modified
    MetricName: SecurityGroupEventCount
    Namespace: CloudTrailMetrics
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 1
    Threshold: 1
    ComparisonOperator: GreaterThanOrEqualToThreshold
    AlarmActions:
      - !Ref SecurityAlertTopic
```

### Regular Security Exercises

1. **Penetration Testing Schedule**:

   - Schedule quarterly security assessments
   - Test both front-end and API endpoints
   - Verify AWS resource security

2. **Security Response Plan**:

   Create a document outlining steps to take during a security incident:
   
   - Contact information for responsible individuals
   - Steps to isolate compromised systems
   - Backup and restoration procedures
   - Communication templates for stakeholders

## AWS Security Hub

Consider enabling AWS Security Hub for comprehensive security monitoring:

```bash
aws securityhub enable-security-hub
```

This integrates with AWS services to provide a comprehensive view of your security posture and compliance status.
