import Joi from 'joi';

/**
 * Contact form validation schema
 * 
 * This schema validates the contact form data with the following rules:
 * - name: Required, must be a string, min 2 chars, max 50 chars
 * - email: Required, must be a valid email format
 * - phone: Optional, but if provided must follow a valid format
 * - message: Required, min 10 chars, max 1000 chars
 */
const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // Don't validate top-level domain
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  phone: Joi.string()
    .pattern(/^[\d\s\-\.\(\)]{10,15}$/)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),

  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message must be at least 10 characters',
      'string.max': 'Message cannot exceed 1000 characters',
      'any.required': 'Message is required'
    })
});

export default contactSchema;
