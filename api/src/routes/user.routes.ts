import { Router, Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Middleware to check if user is self or admin
const isSelfOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }
  if (req.user.userId === req.params.id || req.user.role === Role.ADMIN) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions to access this user' });
  }
};

// Get user by ID (protected, self or admin)
router.get('/:id', protect, isSelfOrAdmin, userController.getUserById);

// Update user by ID (protected, self or admin)
router.put('/:id', protect, isSelfOrAdmin, userController.updateUser);

// Favorite Music routes
router.post('/:id/favorites/:musicId', protect, isSelfOrAdmin, userController.addFavoriteMusic);
router.delete('/:id/favorites/:musicId', protect, isSelfOrAdmin, userController.removeFavoriteMusic);
router.get('/:id/favorites', protect, isSelfOrAdmin, userController.getFavoriteMusic);

export default router;