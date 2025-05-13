"use strict";
/**
 * AWS Service for Lambda Integration
 *
 * This service handles the integration with AWS Lambda for the contact form.
 * It also gets images from the s3 bucket
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processContactForm = void 0;
const client_lambda_1 = require("@aws-sdk/client-lambda");
// Configuration (will be replaced with actual values during deployment)
const REGION = process.env.AWS_REGION || 'us-east-1';
const LAMBDA_FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME || 'dev-portfolio-contact-form';
// Initialize Lambda client
const lambdaClient = new client_lambda_1.LambdaClient({ region: REGION });
/**
 * Invokes the AWS Lambda function for contact form processing
 *
 * @param {FormData} formData - The validated contact form data
 * @returns {Promise<LambdaResponse>} - The response from the Lambda function
 */
const processContactForm = async (formData) => {
    try {
        // Prepare the Lambda invocation parameters
        const params = {
            FunctionName: LAMBDA_FUNCTION_NAME,
            InvocationType: 'RequestResponse', // Synchronous invocation
            LogType: 'None',
            Payload: Buffer.from(JSON.stringify({
                body: formData
            }))
        };
        // Invoke the Lambda function
        const command = new client_lambda_1.InvokeCommand(params);
        const response = await lambdaClient.send(command);
        // Process the Lambda response
        if (response.StatusCode !== 200) {
            console.error('Lambda invocation failed with status:', response.StatusCode);
            throw new Error(`Lambda invocation failed with status code ${response.StatusCode}`);
        }
        // Convert the Uint8Array payload to a string and parse as JSON
        const payload = new TextDecoder().decode(response.Payload);
        const parsedPayload = JSON.parse(payload);
        // Check for Lambda execution errors
        if (parsedPayload.FunctionError) {
            console.error('Lambda execution error:', parsedPayload);
            throw new Error('Error executing Lambda function');
        }
        // Parse the body from the Lambda response
        const body = JSON.parse(parsedPayload.body);
        return {
            statusCode: parsedPayload.statusCode,
            body
        };
    }
    catch (error) {
        console.error('Error processing contact form with Lambda:', error);
        throw error;
    }
};
exports.processContactForm = processContactForm;
//# sourceMappingURL=awsLambda.service.js.map