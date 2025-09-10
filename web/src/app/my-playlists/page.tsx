'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { getUserPlaylists, createPlaylist } from '@/services/api';

interface Playlist {
  id: string;
  name: string;
}

const MyPlaylistsPage = () => {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const fetchPlaylists = useCallback(async () => {
    try {
      const res = await getUserPlaylists(token!);
      setPlaylists(res.data);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPlaylists();
    }
  }, [token, fetchPlaylists]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist({ name: newPlaylistName }, token!);
      setNewPlaylistName('');
      setShowModal(false);
      fetchPlaylists(); // Refresh the list
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Minhas Playlists</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Criar Nova Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <Link key={playlist.id} href={`/my-playlists/${playlist.id}`} className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-semibold truncate">{playlist.name}</h2>
          </Link>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Criar Nova Playlist</h2>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Nome da Playlist"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlaylistsPage;
