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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPaintings = exports.getAllImages = void 0;
exports.getS3Client = getS3Client;
const client_s3_1 = require("@aws-sdk/client-s3");
const AWS = __importStar(require("aws-sdk"));
// For newer versions of aws-amplify, the import might need to be adjusted
// We'll use a more compatible approach for authentication
const REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'paintings';
let s3Client;
/**
 * Initialize the S3 client based on environment
 */
async function getS3Client() {
    try {
        if (process.env.ENVIRONMENT === 'dev') {
            // Local development - use local credentials
            s3Client = new client_s3_1.S3Client({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
                },
                region: process.env.AWS_REGION || 'us-east-1'
            });
        }
        else {
            // Production - use IAM role through AWS SDK
            // This is a simplified approach that works with both older and newer AWS SDKs
            const awsCredentials = new AWS.SharedIniFileCredentials();
            s3Client = new client_s3_1.S3Client({
                credentials: {
                    accessKeyId: awsCredentials.accessKeyId,
                    secretAccessKey: awsCredentials.secretAccessKey,
                    sessionToken: awsCredentials.sessionToken
                },
                region: REGION
            });
        }
    }
    catch (error) {
        console.error('Error getting S3 client:', error);
        throw error;
    }
}
/**
 * Fetches all images metadata from the S3 bucket
 * @returns {Promise<Array<S3Image>>} - Array of image objects with metadata
 */
const getAllImages = async () => {
    try {
        if (!s3Client) {
            console.log('Getting S3 client...');
            await getS3Client();
        }
        console.log('Fetching images from S3 bucket...');
        console.log('s3Client', s3Client);
        const params = {
            Bucket: S3_BUCKET_NAME,
            // Optional: filter by prefix if images are in a specific folder
            // Prefix: 'paintings/'
        };
        const command = new client_s3_1.ListObjectsV2Command(params);
        const response = await s3Client.send(command);
        if (!response.Contents) {
            console.log('No images found in S3 bucket', response);
            return [];
        }
        // Transform the response to a more usable format
        // Only include image files (based on extension)
        const images = response.Contents
            .filter(item => {
            if (!item.Key)
                return false;
            const key = item.Key.toLowerCase();
            return key.endsWith('.jpg') || key.endsWith('.jpeg') ||
                key.endsWith('.png') || key.endsWith('.gif');
        })
            .map(item => ({
            key: item.Key,
            url: `https://${S3_BUCKET_NAME}.s3.${REGION}.amazonaws.com/${item.Key}`,
            lastModified: item.LastModified,
            size: item.Size,
            // Additional metadata if needed
        }));
        return images;
    }
    catch (error) {
        console.error('Error fetching images from S3:', error);
        throw error;
    }
};
exports.getAllImages = getAllImages;
/**
 * Load paintings from S3
 * This is a wrapper for getAllImages to maintain compatibility with existing code
 */
const loadPaintings = async () => {
    return getAllImages();
};
exports.loadPaintings = loadPaintings;
//# sourceMappingURL=awsS3.service.js.map