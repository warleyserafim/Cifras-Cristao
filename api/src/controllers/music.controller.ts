import { Request, Response } from 'express';
import * as musicService from '../services/music.service';

export const getAllMusic = async (req: Request, res: Response) => {
  try {
    const tag = req.query.tag as string | undefined; // Get tag from query
    const searchQuery = req.query.searchQuery as string | undefined; // Get searchQuery from query
    const music = await musicService.getAllMusic(tag, searchQuery);
    res.status(200).json(music);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMusicById = async (req: Request, res: Response) => {
  try {
    const music = await musicService.getMusicById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    res.status(200).json(music);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMusic = async (req: Request, res: Response) => {
  try {
    // req.body should now contain title, tone, content, videoUrl, artistId, tagIds
    const newMusic = await musicService.createMusic(req.body);
    res.status(201).json(newMusic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMusic = async (req: Request, res: Response) => {
  try {
    const music = await musicService.updateMusic(req.params.id, req.body);
    res.status(200).json(music);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMusic = async (req: Request, res: Response) => {
  try {
    await musicService.deleteMusic(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};