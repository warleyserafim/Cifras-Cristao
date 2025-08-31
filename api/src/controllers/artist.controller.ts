import { Request, Response } from 'express';
import * as artistService from '../services/artist.service';

export const getAllArtists = async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId as string | undefined; // Get categoryId from query
    const artists = await artistService.getAllArtists(categoryId);
    res.status(200).json(artists);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getArtistById = async (req: Request, res: Response) => {
  try {
    const artist = await artistService.getArtistById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json(artist);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createArtist = async (req: Request, res: Response) => {
  try {
    // req.body should now contain name, photoUrl, and categoryId
    const artist = await artistService.createArtist(req.body);
    res.status(201).json(artist);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateArtist = async (req: Request, res: Response) => {
  try {
    const artist = await artistService.updateArtist(req.params.id, req.body);
    res.status(200).json(artist);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteArtist = async (req: Request, res: Response) => {
  try {
    await artistService.deleteArtist(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};