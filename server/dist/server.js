"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)()); // Allow cross-origin requests
app.use(body_parser_1.default.json()); // Parse JSON request bodies
app.use(body_parser_1.default.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// Routes
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/paintings', contactRoutes_1.default);
// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Portfolio API server is running' });
});
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
//# sourceMappingURL=server.js.map