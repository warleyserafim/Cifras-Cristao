'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFavoriteMusic } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

interface Music {
  id: string;
  title: string;
  tone: string;
  artist: {
    id: string;
    name: string;
    photoUrl?: string;
  };
}

export default function MyFavoritesPage() {
  const [favoriteMusic, setFavoriteMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    const currentUser = JSON.parse(storedUser);

    const fetchFavorites = async () => {
      try {
        const response = await getFavoriteMusic(currentUser.id);
        setFavoriteMusic(response.data);
      } catch (err) {
        console.error('Failed to fetch favorite music:', err);
        setError('Falha ao carregar suas cifras favoritas.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  if (loading) {
    return <div className="text-center text-xl mt-8">Carregando suas cifras favoritas...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold my-8">Minhas Cifras Favoritas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteMusic.length > 0 ? (
          favoriteMusic.map((music) => (
            <Link key={music.id} href={`/music/${music.id}`}>
              <div className="bg-[var(--color-card-background)] p-4 rounded-lg shadow-lg hover:bg-[var(--color-card-background)]/80 transition-colors duration-300 flex flex-col items-center text-center">
                {music.artist.photoUrl ? (
                  <Image 
                    src={music.artist.photoUrl}
                    alt={music.artist.name}
                    width={64}
                    height={64}
                    className="rounded-full mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--color-background)] flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <h2 className="text-xl font-semibold">{music.title}</h2>
                <p className="text-[var(--color-text-secondary)] text-sm">{music.artist.name}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full">Você ainda não favoritou nenhuma cifra.</p>
        )}
      </div>
    </div>
  );
}
