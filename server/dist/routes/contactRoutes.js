"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactSchema_1 = __importDefault(require("../validation/contactSchema"));
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const lambdaService = __importStar(require("../services/awsLambda.service"));
const s3Service = __importStar(require("../services/awsS3.service"));
const router = express_1.default.Router();
/**
 * POST /api/contact
 *
 * Handles contact form submissions.
 * 1. Validates the request data using Joi schema
 * 2. Forwards validated data to AWS Lambda via the AWS service
 * 3. Returns the processed response to the client
 */
router.post('/', (0, validateRequest_1.default)(contactSchema_1.default), async (req, res) => {
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
        }
        else {
            // Return error response with status code from Lambda
            return res.status(lambdaResponse.statusCode).json({
                success: false,
                message: lambdaResponse.body.message || 'There was a problem processing your request.',
                errors: lambdaResponse.body.errors
            });
        }
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Error fetching paintings:', error);
        return res.status(500).json({
            success: false,
            message: 'There was a problem processing your request. Please try again later.'
        });
    }
});
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map