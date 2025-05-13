import { S3Client, ListObjectsV2Command, ListObjectsV2CommandInput, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as AWS from 'aws-sdk';
// For newer versions of aws-amplify, the import might need to be adjusted
// We'll use a more compatible approach for authentication

const REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'ptoner92';

interface S3Image {
  key: string;
  url: string;
  lastModified?: Date;
  size?: number;
}

interface ImageMetaData {
  title?: string;
  description?: string;
  createddate?: string;
}

let s3Client: S3Client;

/**
 * Initialize the S3 client based on environment
 */
async function getS3Client(): Promise<void> {
  try {
    if (process.env.ENVIRONMENT === 'dev') {
      // Local development - use local credentials
      s3Client = new S3Client({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        },
        region: process.env.AWS_REGION || 'us-east-1'
      });
    } else {
      // Production - use IAM role through AWS SDK
      // This is a simplified approach that works with both older and newer AWS SDKs
      const awsCredentials = new AWS.SharedIniFileCredentials();
      s3Client = new S3Client({
        credentials: {
          accessKeyId: awsCredentials.accessKeyId,
          secretAccessKey: awsCredentials.secretAccessKey,
          sessionToken: awsCredentials.sessionToken
        },
        region: REGION
      });
    }
  } catch (error) {
    console.error('Error getting S3 client:', error);
    throw error;
  }
}

async function generatePresignedUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: "ptoner92",
      Key: key
    });
    // URL expires in 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

async function getMetaData(key: string): Promise<ImageMetaData> {
  try {
    const headParams = {
      Bucket: S3_BUCKET_NAME,
      Key: key
    };
    const headCommand = new HeadObjectCommand(headParams);
    const headResponse = await s3Client.send(headCommand);
    return headResponse.Metadata || {};
  } catch (error) {
    console.error('Error getting metadata:', error);
    throw error;
  }
}

/**
 * Fetches all images metadata from the S3 bucket
 * @returns {Promise<Array<S3Image>>} - Array of image objects with metadata
 */
const loadPaintings = async (): Promise<S3Image[]> => {
  try {
    if (!s3Client) {
      await getS3Client();
    }
    
    const params: ListObjectsV2CommandInput = {
      Bucket: S3_BUCKET_NAME,
      Prefix: 'portfolio/paintings'
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    if (!response.Contents) {
      console.log('No images found in S3 bucket', response);
      return [];
    }

    // Transform the response to a more usable format
    // Only include image files (based on extension)
    var images = await Promise.all(response.Contents
      .filter(item => {
        if (!item.Key) return false;
        const key = item.Key.toLowerCase();
        return key.endsWith('.jpg') || key.endsWith('.jpeg') || 
               key.endsWith('.png') || key.endsWith('.gif');
      })
      .map(async item => { 
        const presignedUrl = await generatePresignedUrl(item.Key || '');
        const metaData = await getMetaData(item.Key || '');
        return ({
        key: item.Key as string,
        url: presignedUrl,
        lastModified: item.LastModified as Date,
        size: item.Size as number,
        title: metaData?.title,
        createdDate: metaData?.createddate,
        description: metaData?.description,
      })}));

    return images;
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    throw error;
  }
};

const loadPaintingPreviews = async (): Promise<S3Image[]> => {
  try {
    if (!s3Client) {
      await getS3Client();
    }
    
    const params: ListObjectsV2CommandInput = {
      Bucket: S3_BUCKET_NAME,
      Prefix: 'portfolio/paintings'
    };
    
    const paulsThree = [process.env.PAULS_FAV_Painting1, process.env.PAULS_FAV_Painting2, process.env.PAULS_FAV_Painting3];

    // Transform the response to a more usable format
    // Only include image files (based on extension)
    var images = await Promise.all(paulsThree
      .map(async key => {
        const presignedUrl = await generatePresignedUrl(key || '');
        const metaData = await getMetaData(key || '');
        return ({
        key: key as string,
        url: presignedUrl,
        title: metaData?.title,
        createdDate: metaData?.createddate,
        description: metaData?.description,
      })}));

    return images;
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    throw error;
  }
}

/**
 * Load paintings from S3
 * This is a wrapper for getAllImages to maintain compatibility with existing code
 */
// const loadPaintings = async (): Promise<S3Image[]> => {
//   return getAllImages();
// };

export {
  getS3Client,
  loadPaintings,
  loadPaintingPreviews,
};
