const express = require('express');
const router = express.Router();
const contactSchema = require('../validation/contactSchema');
const validateRequest = require('../middleware/validateRequest');
const lambdaService = require('../services/awsLambda.service');
const s3Service = require('../services/awsS3.service');

/**
 * POST /api/contact
 * 
 * Handles contact form submissions.
 * 1. Validates the request data using Joi schema
 * 2. Forwards validated data to AWS Lambda via the AWS service
 * 3. Returns the processed response to the client
 */
router.post('/', validateRequest(contactSchema), async (req, res) => {
  try {
    // Extract validated data from request body
    const { name, email, phone, message } = req.body;
    
    // Log the form submission for debugging purposes
    console.log('-------------------------------------');
    console.log('New Contact Form Submission Received:');
    console.log('-------------------------------------');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone || 'Not provided');
    console.log('Message:', message);
    console.log('-------------------------------------');
    
    // Process the form data through AWS Lambda
    const lambdaResponse = await lambdaService.processContactForm(req.body);
    
    // Check the status code from Lambda
    if (lambdaResponse.statusCode === 200) {
      // Return success response from Lambda
      return res.status(200).json(lambdaResponse.body);
    } else {
      // Return error response with status code from Lambda
      return res.status(lambdaResponse.statusCode).json({
        success: false,
        message: lambdaResponse.body.message || 'There was a problem processing your request.',
        errors: lambdaResponse.body.errors
      });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: 'There was a problem processing your request. Please try again later.'
    });
  }
});

router.get('/paintings', async (req, res) => {
  try {
    console.log('Fetching paintings...');
    const result = await s3Service.loadPaintings();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching paintings:', error);
    return res.status(500).json({
      success: false,
      message: 'There was a problem processing your request. Please try again later.'
    });
  }
})

module.exports = router;
