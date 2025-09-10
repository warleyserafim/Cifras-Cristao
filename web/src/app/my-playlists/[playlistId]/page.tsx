'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { getPlaylistById, removeMusicFromPlaylist, updatePlaylist, deletePlaylist } from '@/services/api';
import Link from 'next/link';

interface Music {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
}

interface Playlist {
  id: string;
  name: string;
  musics: Music[];
}

const PlaylistPage = () => {
  const { token } = useAuth();
  const params = useParams();
  const playlistId = params.playlistId as string;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const fetchPlaylist = useCallback(async () => {
    try {
      const res = await getPlaylistById(playlistId, token!);
      setPlaylist(res.data);
      setNewPlaylistName(res.data.name);
    } catch (error) {
      console.error('Failed to fetch playlist', error);
    }
  }, [playlistId, token]);

  useEffect(() => {
    if (token && playlistId) {
      fetchPlaylist();
    }
  }, [token, playlistId, fetchPlaylist]);

  const handleRemoveMusic = async (musicId: string) => {
    try {
      await removeMusicFromPlaylist(playlistId, musicId, token!);
      fetchPlaylist(); // Refresh the list
    } catch (error) {
      console.error('Failed to remove music from playlist', error);
    }
  };

  const handleRenamePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await updatePlaylist(playlistId, { name: newPlaylistName }, token!);
      setShowRenameModal(false);
      fetchPlaylist(); // Refresh the playlist name
    } catch (error) {
      console.error('Failed to rename playlist', error);
    }
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta playlist?')) {
      try {
        await deletePlaylist(playlistId, token!);
        // Redirect to the playlists page
        window.location.href = '/my-playlists';
      } catch (error) {
        console.error('Failed to delete playlist', error);
      }
    }
  };

  if (!playlist) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{playlist.name}</h1>
        <div>
          <button
            onClick={() => setShowRenameModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Renomear
          </button>
          <button
            onClick={handleDeletePlaylist}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Excluir Playlist
          </button>
        </div>
      </div>

      <div>
        {playlist.musics.length > 0 ? (
          <ul className="space-y-4">
            {playlist.musics.map((music) => (
              <li key={music.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <Link href={`/music/${music.id}`} className="hover:text-green-400">
                    <span className="font-semibold">{music.title}</span>
                    <span className="text-gray-400"> - {music.artist.name}</span>
                </Link>
                <button
                  onClick={() => handleRemoveMusic(music.id)}
                  className="text-red-500 hover:text-red-400 font-semibold"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma música nesta playlist ainda.</p>
        )}
      </div>

      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Renomear Playlist</h2>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Novo nome da Playlist"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRenameModal(false)}
                className="text-gray-400 hover:text-white font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleRenamePlaylist}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
