/**
 * Request validation middleware
 * 
 * This middleware validates request data against a Joi schema.
 * It will reject requests with invalid data and return appropriate error messages.
 * 
 * @param {Object} schema - Joi schema for validating request data
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      // Extract validation error message
      const errorMessage = error.details[0].message;
      
      // Return 400 Bad Request with validation error
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
    
    // If validation passes, proceed to the next middleware/route handler
    next();
  };
};

module.exports = validateRequest;
