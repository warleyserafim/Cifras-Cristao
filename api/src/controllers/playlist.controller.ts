import { Request, Response } from 'express';
import prisma from '../prisma';

// Helper function to get user ID from request
const getUserId = (req: Request): string => {
  if (!req.user || !req.user.userId) {
    throw new Error('User not authenticated or user ID not found.');
  }
  return req.user.userId;
};

// Create a new playlist
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { name } = req.body;

    const playlist = await prisma.playlist.create({
      data: {
        name,
        userId,
      },
    });
    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all playlists for the authenticated user
export const getUserPlaylists = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const playlists = await prisma.playlist.findMany({
      where: {
        userId,
      },
      include: {
        musics: {
          include: {
            artist: true, // Include artist details for each music
          },
        },
      },
    });
    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a playlist by ID
export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: {
        id,
        userId, // Ensure the playlist belongs to the user
      },
      include: {
        musics: {
          include: {
            artist: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.status(200).json(playlist);
  } catch (error) {
    console.error('Error fetching playlist by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a playlist
export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { name } = req.body;

    const playlist = await prisma.playlist.update({
      where: {
        id,
        userId, // Ensure the playlist belongs to the user
      },
      data: {
        name,
      },
    });
    res.status(200).json(playlist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a playlist
export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    await prisma.playlist.delete({
      where: {
        id,
        userId, // Ensure the playlist belongs to the user
      },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add music to a playlist
export const addMusicToPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { playlistId, musicId } = req.params;

    // Verify playlist ownership
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or not owned by user' });
    }

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        musics: {
          connect: { id: musicId },
        },
      },
    });
    res.status(200).json({ message: 'Música adicionada à playlist com sucesso!' });
  } catch (error) {
    console.error('Error adding music to playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove music from a playlist
export const removeMusicFromPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { playlistId, musicId } = req.params;

    // Verify playlist ownership
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or not owned by user' });
    }

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        musics: {
          disconnect: { id: musicId },
        },
      },
    });
    res.status(200).json({ message: 'Música removida da playlist com sucesso!' });
  } catch (error) {
    console.error('Error removing music from playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
