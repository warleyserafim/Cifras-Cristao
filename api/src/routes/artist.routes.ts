import { Router } from 'express';
import * as artistController from '../controllers/artist.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware'; // New import
import { Role } from '@prisma/client'; // New import

const router = Router();

// Public routes
router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);

// Protected routes (only ADMIN can create, update, delete)
router.post('/', protect, authorize(Role.ADMIN), artistController.createArtist);
router.put('/:id', protect, authorize(Role.ADMIN), artistController.updateArtist);
router.delete('/:id', protect, authorize(Role.ADMIN), artistController.deleteArtist);

export default router;
