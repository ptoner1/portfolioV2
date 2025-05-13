/**
 * AWS Service for Lambda Integration
 * 
 * This service handles the integration with AWS Lambda for the contact form.
 * It also gets images from the s3 bucket
 */

const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

// Configuration (will be replaced with actual values during deployment)
const REGION = process.env.AWS_REGION || 'us-east-1';
const LAMBDA_FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME || 'dev-portfolio-contact-form';

// Initialize Lambda client
const lambdaClient = new LambdaClient({ region: REGION });

/**
 * Invokes the AWS Lambda function for contact form processing
 * 
 * @param {Object} formData - The validated contact form data
 * @returns {Promise<Object>} - The response from the Lambda function
 */
const processContactForm = async (formData) => {
  try {
    // Prepare the Lambda invocation parameters
    const params = {
      FunctionName: LAMBDA_FUNCTION_NAME,
      InvocationType: 'RequestResponse', // Synchronous invocation
      LogType: 'None',
      Payload: JSON.stringify({
        body: formData
      })
    };

    // Invoke the Lambda function
    const command = new InvokeCommand(params);
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
  } catch (error) {
    console.error('Error processing contact form with Lambda:', error);
    throw error;
  }
};

module.exports = {
  processContactForm
};
