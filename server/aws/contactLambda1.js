/**
 * AWS Lambda Function for Contact Form Processing
 * 
 * This Lambda function handles contact form submissions by:
 * 1. Validating the received data
 * 2. Sending an email notification using AWS SES
 * 3. Sending a text message notification using AWS SNS
 * 
 * Environment Variables:
 * - RECIPIENT_EMAIL: Email address to send notifications to (paul.p.toner@gmail.com)
 * - RECIPIENT_PHONE: Phone number to send SMS notifications to (7202761928)
 * - SES_REGION: AWS region for SES service
 * - SNS_REGION: AWS region for SNS service
 */

// AWS SDK imports
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

// Configuration
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'paul.p.toner@gmail.com';
const RECIPIENT_PHONE = process.env.RECIPIENT_PHONE || '7202761928';
const SES_REGION = process.env.SES_REGION || 'us-east-1';
const SNS_REGION = process.env.SNS_REGION || 'us-east-1';

// Initialize AWS clients
const sesClient = new SESClient({ region: SES_REGION });
const snsClient = new SNSClient({ region: SNS_REGION });

/**
 * Validate form data
 * Note: This is a secondary validation after our Express backend validation
 */
const validateFormData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('A valid email address is required');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }
  
  if (data.phone && !/^[\d\s\-\.\(\)]{10,15}$/.test(data.phone)) {
    errors.push('Phone number format is invalid');
  }
  
  return errors;
};

/**
 * Send email notification using AWS SES
 */
const sendEmailNotification = async (formData) => {
  const { name, email, phone, message } = formData;
  
  // Format the email content
  const emailParams = {
    Destination: {
      ToAddresses: [RECIPIENT_EMAIL],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `
            New Contact Form Submission
            --------------------------
            From: ${name}
            Email: ${email}
            Phone: ${phone || 'Not provided'}
            
            Message:
            ${message}
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Portfolio Contact: New message from ${name}`,
      },
    },
    Source: RECIPIENT_EMAIL, // This needs to be a verified SES sender
    ReplyToAddresses: [email],
  };
  
  try {
    const command = new SendEmailCommand(emailParams);
    const result = await sesClient.send(command);
    console.log('Email sent successfully:', result.MessageId);
    return result.MessageId;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send SMS notification using AWS SNS
 */
const sendSmsNotification = async (formData) => {
  const { name, email } = formData;
  
  // Format the SMS message
  const smsParams = {
    Message: `${name} has just contacted paulyprograms from ${email}`,
    PhoneNumber: RECIPIENT_PHONE.startsWith('+') ? RECIPIENT_PHONE : `+1${RECIPIENT_PHONE}`,
  };
  
  try {
    const command = new PublishCommand(smsParams);
    const result = await snsClient.send(command);
    console.log('SMS sent successfully:', result.MessageId);
    return result.MessageId;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Main Lambda handler function
 */
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    // Parse the incoming data
    const formData = typeof event.body === 'string' 
      ? JSON.parse(event.body) 
      : event.body;
    
    // Validate the form data
    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // For CORS support
        },
        body: JSON.stringify({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        }),
      };
    }
    
    // Send notifications in parallel
    const [emailResult, smsResult] = await Promise.all([
      sendEmailNotification(formData),
      sendSmsNotification(formData),
    ]);
    
    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // For CORS support
      },
      body: JSON.stringify({
        success: true,
        message: 'Your message has been received. Thank you for contacting us!',
        details: {
          emailId: emailResult,
          smsId: smsResult,
        },
      }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // For CORS support
      },
      body: JSON.stringify({
        success: false,
        message: 'There was an error processing your request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};
