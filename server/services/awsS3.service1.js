const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
// const AWS = require('aws-sdk');
// import AWS from 'aws-sdk';
const Auth = require('aws-amplify');
// import { Auth } from 'aws-amplify';

const REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'paintings';


// const s3Client = new S3Client({ region: REGION });
var s3Client;
// async function getS3Client() {
//     if (process.env.ENVIRONMENT === 'dev') {
//       // Local development - use local credentials
//       return new AWS.S3({
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         region: process.env.AWS_REGION || 'us-east-1'
//       });
//     } else {
//       // Production - use IAM role through Amplify Auth
//       const credentials = await Auth.currentCredentials();
//       return new AWS.S3({
//         credentials: Auth.essentialCredentials(credentials)
//       });
//     }
//   }
async function getS3Client() {
    try {
        if (process.env.ENVIRONMENT === 'dev') {
            // Local development - use local credentials
            s3Client = new S3Client({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION || 'us-east-1'
            });
        } else {
            // Production - use IAM role through Amplify Auth
            const credentials = await Auth.currentCredentials();
            s3Client = new S3Client({
                credentials: Auth.essentialCredentials(credentials)
            });
        }
    } catch (error) {
        console.error('Error getting S3 client:', error);
        throw error;
    }
  }

/**
 * Fetches all images metadata from the S3 bucket
 * @returns {Promise<Array>} - Array of image objects with metadata
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
  
      const command = new ListObjectsV2Command(params);
      const response = await s3Client.send(command);
  
      if (!response.Contents) {
        console.log('No images found in S3 bucket', response);
        return [];
      }
  
      // Transform the response to a more usable format
      // Only include image files (based on extension)
      const images = response.Contents
        .filter(item => {
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
    } catch (error) {
      console.error('Error fetching images from S3:', error);
      throw error;
    }
  };
  
  module.exports = {
    getAllImages,
    getS3Client
  };
  