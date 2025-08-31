import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addFavoriteMusic = async (req: Request, res: Response) => {
  try {
    const { id, musicId } = req.params;
    const user = await userService.addFavoriteMusic(id, musicId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFavoriteMusic = async (req: Request, res: Response) => {
  try {
    const { id, musicId } = req.params;
    const user = await userService.removeFavoriteMusic(id, musicId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFavoriteMusic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const favorites = await userService.getFavoriteMusic(id);
    res.status(200).json(favorites);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};