import { Router } from 'express';
import * as musicController from '../controllers/music.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware'; // New import
import { Role } from '@prisma/client'; // New import

const router = Router();

// Public routes
router.get('/', musicController.getAllMusic);
router.get('/:id', musicController.getMusicById);

// Protected routes (only ADMIN can create, update, delete)
router.post('/', protect, authorize(Role.ADMIN), musicController.createMusic);
router.put('/:id', protect, authorize(Role.ADMIN), musicController.updateMusic);
router.delete('/:id', protect, authorize(Role.ADMIN), musicController.deleteMusic);

export default router;
