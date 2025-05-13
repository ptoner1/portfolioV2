"use strict";
/**
 * Lambda Deployment Script
 *
 * This script automates the deployment process for the AWS Lambda function:
 * 1. Creates a ZIP archive of the Lambda function code
 * 2. Uploads the ZIP to an S3 bucket
 * 3. Updates the Lambda function with the new code
 *
 * Prerequisites:
 * - AWS CLI configured with appropriate credentials
 * - S3 bucket already created (named according to environment-portfolio-lambda-code)
 * - Environment variables set in .env file
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
dotenv_1.default.config();
const execAsync = util_1.default.promisify(child_process_1.exec);
// Configuration
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
const REGION = process.env.AWS_REGION || 'us-east-1';
const LAMBDA_FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME || `${ENVIRONMENT}-portfolio-contact-form`;
const S3_BUCKET = process.env.S3_BUCKET || `${ENVIRONMENT}-portfolio-lambda-code`;
const S3_KEY = 'contactLambda.zip';
// File paths
const LAMBDA_DIR = path_1.default.resolve(__dirname);
const LAMBDA_FILE = path_1.default.join(LAMBDA_DIR, 'contactLambda.ts');
const PACKAGE_JSON = path_1.default.join(__dirname, '..', 'package.json');
const ZIP_FILE = path_1.default.join(LAMBDA_DIR, S3_KEY);
/**
 * Creates a ZIP archive of the Lambda function code
 */
const createZipFile = async () => {
    console.log('Creating ZIP archive of Lambda function code...');
    try {
        // Create a temporary directory for packaging
        const tempDir = path_1.default.join(LAMBDA_DIR, 'temp');
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir);
        }
        // Copy the Lambda function file to the temp directory
        fs_1.default.copyFileSync(LAMBDA_FILE, path_1.default.join(tempDir, 'contactLambda.ts'));
        // Create a package.json with only the AWS SDK dependencies
        const packageJson = JSON.parse(fs_1.default.readFileSync(PACKAGE_JSON, 'utf8'));
        const lambdaPackageJson = {
            name: 'portfolio-contact-lambda',
            version: packageJson.version,
            description: 'AWS Lambda function for portfolio contact form',
            main: 'contactLambda.js',
            dependencies: {
                '@aws-sdk/client-ses': packageJson.dependencies['@aws-sdk/client-ses'],
                '@aws-sdk/client-sns': packageJson.dependencies['@aws-sdk/client-sns']
            }
        };
        fs_1.default.writeFileSync(path_1.default.join(tempDir, 'package.json'), JSON.stringify(lambdaPackageJson, null, 2));
        // Install dependencies in the temp directory
        console.log('Installing Lambda dependencies...');
        await execAsync('npm install --production', { cwd: tempDir });
        // Compile TypeScript to JavaScript
        console.log('Compiling TypeScript to JavaScript...');
        fs_1.default.writeFileSync(path_1.default.join(tempDir, 'tsconfig.json'), JSON.stringify({
            compilerOptions: {
                target: "ES2020",
                module: "CommonJS",
                esModuleInterop: true,
                outDir: "./",
                strict: true,
                skipLibCheck: true
            },
            include: ["*.ts"]
        }, null, 2));
        await execAsync('npx tsc', { cwd: tempDir });
        // Create ZIP file
        console.log('Creating ZIP archive...');
        if (fs_1.default.existsSync(ZIP_FILE)) {
            fs_1.default.unlinkSync(ZIP_FILE);
        }
        // Use system's zip command (cross-platform alternatives can be used if needed)
        await execAsync(`cd ${tempDir} && zip -r ${ZIP_FILE} .`);
        // Clean up temp directory
        console.log('Cleaning up temporary files...');
        fs_1.default.rmSync(tempDir, { recursive: true, force: true });
        console.log(`ZIP archive created at: ${ZIP_FILE}`);
        return ZIP_FILE;
    }
    catch (error) {
        console.error('Error creating ZIP file:', error);
        throw error;
    }
};
/**
 * Uploads the ZIP file to S3
 */
const uploadToS3 = async () => {
    console.log(`Uploading ZIP to S3 bucket: ${S3_BUCKET}/${S3_KEY}...`);
    try {
        await execAsync(`aws s3 cp ${ZIP_FILE} s3://${S3_BUCKET}/${S3_KEY} --region ${REGION}`);
        console.log('Upload to S3 completed successfully');
    }
    catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};
/**
 * Updates the Lambda function code
 */
const updateLambdaFunction = async () => {
    console.log(`Updating Lambda function: ${LAMBDA_FUNCTION_NAME}...`);
    try {
        await execAsync(`aws lambda update-function-code --function-name ${LAMBDA_FUNCTION_NAME} ` +
            `--s3-bucket ${S3_BUCKET} --s3-key ${S3_KEY} --region ${REGION}`);
        console.log('Lambda function updated successfully');
    }
    catch (error) {
        console.error('Error updating Lambda function:', error);
        throw error;
    }
};
/**
 * Main deployment function
 */
const deployLambda = async () => {
    try {
        console.log('Starting Lambda deployment process...');
        // Check if AWS CLI is installed
        try {
            await execAsync('aws --version');
        }
        catch (error) {
            console.error('AWS CLI is not installed or not in PATH. Please install it first.');
            return;
        }
        // Create ZIP file
        await createZipFile();
        // Upload to S3
        await uploadToS3();
        // Update Lambda function
        await updateLambdaFunction();
        console.log('Lambda deployment completed successfully!');
    }
    catch (error) {
        console.error('Lambda deployment failed:', error);
        process.exit(1);
    }
};
// Run the deployment
deployLambda();
//# sourceMappingURL=deployLambda.js.map