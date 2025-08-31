import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware'; // New import
import { Role } from '@prisma/client'; // New import

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);

// Protected routes (only ADMIN can create, delete)
router.post('/', protect, authorize(Role.ADMIN), categoryController.createCategory);
router.delete('/:id', protect, authorize(Role.ADMIN), categoryController.deleteCategory);

export default router;
