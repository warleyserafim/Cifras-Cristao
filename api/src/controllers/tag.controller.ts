import { Request, Response } from 'express';
import * as tagService from '../services/tag.service';

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const tag = await tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    await tagService.deleteTag(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};