'use client'; // Make it a client component

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getArtists } from '@/services/api';
import Link from 'next/link';
import AdminControls from '@/components/AdminControls';
import Image from 'next/image';
import SearchInputWithDropdown from '@/components/SearchInputWithDropdown'; // Import the new component

// Define the type for an artist to include the new photoUrl field
interface Artist {
  id: string;
  name: string;
  photoUrl?: string;
}

// This is a new component defined right in the page for simplicity.
// It represents a single artist card.
const ArtistCard = ({ artist }: { artist: Artist }) => {
  return (
    <Link href={`/artists/${artist.id}`}>
      <div className="group flex flex-col items-center text-center gap-2 transform transition-transform duration-300 hover:scale-105">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors duration-300">
          {artist.photoUrl ? (
            <Image 
              src={artist.photoUrl}
              alt={artist.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            // Placeholder if no photo is available
            <div className="w-full h-full bg-[var(--color-card-background)] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--color-text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <span className="font-semibold text-lg group-hover:text-[var(--color-primary)] transition-colors duration-300">{artist.name}</span>
      </div>
    </Link>
  );
};


export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await getArtists(categoryId || undefined);
        setArtists(response.data);
      } catch (err) {
        console.error('Failed to fetch artists:', err);
        setError('Falha ao carregar artistas.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [categoryId]); // Re-fetch when categoryId changes

  if (loading) {
    return <div className="text-center text-xl mt-8">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold my-8">Encontre suas cifras favoritas</h1>
      <SearchInputWithDropdown /> {/* Use the new component here */}

      <AdminControls />

      <div>
        <h2 className="text-2xl font-semibold mb-8">Artistas em Destaque</h2>
        {artists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-8 gap-x-4">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <p>Nenhum artista encontrado. O backend está rodando e populado?</p>
        )}
      </div>
    </div>
  );
}