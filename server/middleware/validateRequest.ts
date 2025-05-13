import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

/**
 * Request validation middleware
 * 
 * This middleware validates request data against a Joi schema.
 * It will reject requests with invalid data and return appropriate error messages.
 * 
 * @param {Schema} schema - Joi schema for validating request data
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

export default validateRequest;
