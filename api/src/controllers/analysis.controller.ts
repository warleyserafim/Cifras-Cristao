import { Request, Response } from 'express';
import { analyzeMusic as analyzeMusicService } from '../services/analysis.service';

export const analyzeMusic = async (req: Request, res: Response) => {
  const { youtubeUrl } = req.body;

  if (!youtubeUrl) {
    return res.status(400).json({ message: 'YouTube URL is required.' });
  }

  try {
    const result = await analyzeMusicService(youtubeUrl);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error analyzing music:', error);
    res.status(500).json({ message: error.message || 'Failed to analyze music.' });
  }
};