'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useAuth from '@/hooks/useAuth';
import { getUserPlaylists, addMusicToPlaylist } from '@/services/api';
import Link from 'next/link';
import { IoMdClose } from 'react-icons/io';

interface Playlist {
  id: string;
  name: string;
}

interface AddToPlaylistModalProps {
  musicId: string;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ musicId, onClose }) => {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

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

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addMusicToPlaylist(playlistId, musicId, token!);
      onClose();
      alert('Música adicionada à playlist com sucesso!');
    } catch (error) {
      console.error('Failed to add music to playlist', error);
      alert('Erro ao adicionar música à playlist.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Adicionar à Playlist</h2>
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handleAddToPlaylist(playlist.id)}
              className="w-full text-left bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              {playlist.name}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-between items-center">
            <Link href="/my-playlists" className="text-green-500 hover:underline">
                Criar nova playlist
            </Link>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white font-semibold flex items-center gap-1"
            >
                <IoMdClose /> Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
