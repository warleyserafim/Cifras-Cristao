'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getArtistById, deleteArtist } from '@/services/api';
import Link from 'next/link';
import AddMusicButton from '@/components/AddMusicButton';
import Image from 'next/image';

// Define types for our data, including photoUrl and category
interface Music {
  id: string;
  title: string;
}

interface Artist {
  id: string;
  name: string;
  photoUrl?: string;
  category?: {
    id: string;
    name: string;
  };
  musics: Music[];
}

export default function ArtistPage() {
  const router = useRouter();
  const params = useParams();
  const artistId = params.artistId as string;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }

    const fetchArtist = async () => {
      try {
        const response = await getArtistById(artistId);
        setArtist(response.data);
        setLoading(false);
      } catch (err) {
        console.error(`Failed to fetch artist ${artistId}:`, err);
        setError('Artista não encontrado ou erro ao carregar.');
        setLoading(false);
      }
    };
    fetchArtist();
  }, [artistId]);

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  if (error || !artist) {
    return <div className="text-center text-red-500">{error || 'Artista não encontrado.'}</div>;
  }

  const handleDeleteArtist = async () => {
    if (window.confirm('Tem certeza que deseja apagar este artista e todas as suas músicas?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        await deleteArtist(artist.id, token);
        router.push('/'); // Redirect to home page after deletion
      } catch (err) {
        console.error('Falha ao apagar artista:', err);
        alert('Erro ao apagar artista.');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-card-background)] shadow-lg flex-shrink-0">
          {artist.photoUrl ? (
            <Image
              src={artist.photoUrl}
              alt={artist.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-card-background)] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--color-text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h1 className="text-5xl font-bold">{artist.name}</h1>
          {artist.category && (
            <p className="text-xl text-[var(--color-text-secondary)] mt-2">Categoria: {artist.category.name}</p>
          )}
        </div>
        <div className="flex-shrink-0 flex gap-4 items-center">
          <AddMusicButton artistId={artist.id} />
          {userRole === 'ADMIN' && (
            <button onClick={handleDeleteArtist} className="btn btn-destructive">
              Apagar Artista
            </button>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-card-background)] rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-6">Músicas</h2>
        {artist.musics.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {artist.musics.map((music) => (
              <Link key={music.id} href={`/music/${music.id}`}>
                <div className="p-4 -mx-6 hover:bg-[var(--color-background)] transition-colors duration-200">
                  {music.title}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[var(--color-text-secondary)]">Nenhuma música encontrada para este artista.</p>
        )}
      </div>
    </div>
  );
}
