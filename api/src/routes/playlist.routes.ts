import { Router } from 'express';
import * as playlistController from '../controllers/playlist.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protected routes for playlists
router.route('/')
  .post(protect, playlistController.createPlaylist) // Create a new playlist
  .get(protect, playlistController.getUserPlaylists); // Get all playlists for the authenticated user

router.route('/:id')
  .get(protect, playlistController.getPlaylistById) // Get a playlist by ID
  .put(protect, playlistController.updatePlaylist) // Update a playlist
  .delete(protect, playlistController.deletePlaylist); // Delete a playlist

router.route('/:playlistId/musics/:musicId')
  .post(protect, playlistController.addMusicToPlaylist) // Add music to a playlist
  .delete(protect, playlistController.removeMusicFromPlaylist); // Remove music from a playlist

export default router;
