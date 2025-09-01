import { Request, Response } from 'express';
import * as commentService from '../services/comment.service';
import { Role } from '@prisma/client';

export const getCommentsByMusicId = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getCommentsByMusicId(req.params.musicId);
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await commentService.createComment({ ...req.body, userId });
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await commentService.getCommentById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (userRole !== 'ADMIN' && comment.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await commentService.deleteComment(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
