import { Router, RequestHandler } from 'express';
import * as commentController from '../controllers/comment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/:musicId', commentController.getCommentsByMusicId);
router.post('/', protect, commentController.createComment);
router.delete('/:id', protect, commentController.deleteComment as RequestHandler);

export default router;