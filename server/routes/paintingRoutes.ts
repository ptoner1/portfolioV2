import express, { Request, Response } from 'express';
import * as s3Service from '../services/awsS3.service';

const router = express.Router();



router.get('/', async (req: Request, res: Response) => {
    try {
      const result = await s3Service.loadPaintings();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching paintings:', error);
      return res.status(500).json({
        success: false,
        message: 'There was a problem processing your request. Please try again later.'
      });
    }
  });

router.get('/preview', async (req: Request, res: Response) => {
  try {
    const result = await s3Service.loadPaintingPreviews();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching preview paintings:', error);
    return res.status(500).json({
      success: false,
      message: 'There was a problem processing your request. Please try again later.'
    });
  }
})

export default router;