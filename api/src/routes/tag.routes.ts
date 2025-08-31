import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware'; // New import
import { Role } from '@prisma/client'; // New import

const router = Router();

// Public routes
router.get('/', tagController.getAllTags);

// Protected routes (only ADMIN can create, delete)
router.post('/', protect, authorize(Role.ADMIN), tagController.createTag);
router.delete('/:id', protect, authorize(Role.ADMIN), tagController.deleteTag);

export default router;
