import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import sanitizeHtml from 'sanitize-html';

const { EMAIL1, EMAIL2, FROM_ADDRESS } = process.env;

const ses = new SESClient({
  region: 'us-east-1'
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,POST"
};

// Important contact information is sent to Paul
const createSendEmailCommandToPaul = (cleanedFormData) => {
  const formData = JSON.parse(cleanedFormData);
  
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [EMAIL1, EMAIL2],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h3>
            Hey Paul,</h3>
            <p>You have a new message from: ${formData.name}: ${formData.email}, ${formData.phone || "{no phone provided}"}</p>
            <p>${formData.message}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New Contact from PaulyPrograms`
      },
    },
    Source: FROM_ADDRESS,
    ReplyToAddresses: [FROM_ADDRESS],
  });
};

// Client gets a confirmation email
const createSendEmailCommandToClient = (cleanedFormData) => {
  const userData = JSON.parse(cleanedFormData);
  
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [userData.email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: 'Trebuchet MS', Tahoma, 'Fixed Width', sans-serif;">
              <h3>Hi ${userData.name}!</h3>
              <p>Thanks for reaching out.</p>
              <p>Your message is now in my inbox.  I'll respond when I can!</p>
            
              <p style="margin-top: 1rem">-Paul</p>
            </div>
            `,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Message Received`
      },
    },
    Source: FROM_ADDRESS,
    ReplyToAddresses: [FROM_ADDRESS],
  });
};

export const handler = async (event) => {
  console.log("received event: ", event)
  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const rawFormData = event.body;
  const cleanedFormData = {
    name: sanitizeHtml(rawFormData.name, { allowedTags: [], allowedAttributes: {} }),
    email: sanitizeHtml(rawFormData.email, { allowedTags: [], allowedAttributes: {} }),
    phone: sanitizeHtml(rawFormData.phone || "", { allowedTags: [], allowedAttributes: {} }),
    message: sanitizeHtml(rawFormData.message, { allowedTags: [], allowedAttributes: {} })
  };

  const sendEmailCommandToPaul = createSendEmailCommandToPaul(cleanedFormData);
  const sendEmailCommandToClient = createSendEmailCommandToClient(cleanedFormData);

  const emailErrorResponse = (error) => {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.message || 'Failed to send follow-up email'
      })
    }
  };

  try {
    const result = await ses.send(sendEmailCommandToPaul);
    const httpObject = {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Email sent successfully',
        result: result
      })
    };
    
    try {
      const followUpResult = await ses.send(sendEmailCommandToClient);
      httpObject.statusCode = 200;
      return httpObject
    } catch (caught) {
      console.error('Error sending follow-up email:', caught);
      return emailErrorResponse(caught);
    }

    // return httpObject;
  } catch (caught) {
    console.error('Error sending email:', caught);
    return emailErrorResponse(caught);
  }
};
