// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');

/**
 * Express Server Configuration
 * 
 * This is a simple Express server that handles our contact form submissions.
 * In a production environment, this would be expanded to include:
 * - Database connections
 * - Authentication middleware
 * - Additional API routes
 * - Environment configuration
 * - Logging
 */

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/paintings', contactRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`To test the server, visit http://localhost:${PORT}`);
  console.log(`Contact form endpoint is available at http://localhost:${PORT}/api/contact`);
});

/**
 * Server Features:
 * 
 * 1. Form Validation - Uses Joi schema validation through middleware
 * 2. Error Handling - Centralized error handling middleware
 * 3. CORS Support - Allows frontend requests from different origin
 * 4. RESTful Structure - Organized routes and controllers
 * 
 * Future Enhancements:
 * - Add authentication for admin routes
 * - Implement email sending functionality using nodemailer or a service like SendGrid
 * - Add database storage for form submissions
 * - Implement rate limiting to prevent abuse
 * - Add logging with Winston or similar
 */
