'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMusicById, deleteMusic, addFavoriteMusic, removeFavoriteMusic, getFavoriteMusic } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import ChordTooltip from '@/components/ChordTooltip';
import CommentSection from '@/components/CommentSection';
import AddToPlaylistModal from '@/components/AddToPlaylistModal';
import ChordInteractiveDisplay from '@/components/ChordInteractiveDisplay';

// Define types for our data
interface MusicData {
  id: string;
  title: string;
  tone: string;
  content: string;
  videoUrl?: string;
  artist: {
    id: string;
    name: string;
    photoUrl?: string;
  };
  tags: { tag: { id: string; name: string; } }[];
}

import { transposeChord } from '@/utils/musicUtils';

const transposeContent = (content: string, semitones: number): string => {
  if (semitones === 0) return content;

  return content.replace(/\[([A-G][#b]?(?:m|maj|min|sus|add|dim|aug)?[0-9]*(?:\/[A-G][#b]?)?)\]/g, (match, chord) => {
    const transposedChord = transposeChord(chord, semitones);
    return `[${transposedChord}]`; // Keep the square bracket format
  });
};



// --- Component for YouTube Embed ---
const YouTubeEmbed = ({ videoUrl }: { videoUrl: string }) => {
    const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch && videoIdMatch[1] ? videoIdMatch[1] : null;

  if (!videoId) {
    return (
      <div className="bg-[var(--color-card-background)] p-6 rounded-lg text-center">
        <p>URL do YouTube inválida ou não encontrada.</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
};

// --- Main Page Component ---
export default function MusicPage() {
  const params = useParams();
  const musicId = params.musicId as string;
  const router = useRouter();
  const [music, setMusic] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [semitoneChange, setSemitoneChange] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const { isLoggedIn, user } = useAuth();
  const currentUserId = user?.id;
  const isAdmin = user?.role === 'ADMIN';
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);

  

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await getMusicById(musicId);
        setMusic(response.data);

        if (user && currentUserId) { // Add currentUserId check here
          const favoritesResponse = await getFavoriteMusic(currentUserId);
          const favorites: MusicData[] = favoritesResponse.data;
          setIsFavorited(Array.isArray(favorites) && favorites.some((favMusic: MusicData) => favMusic.id === musicId));
        }
        setLoading(false);
      } catch (err) {
        console.error(`Failed to fetch music ${musicId}:`, err);
        setError('Música não encontrada ou erro ao carregar.');
        setLoading(false);
      }
    };
    fetchMusic();
  }, [musicId, user, currentUserId]);

  if (loading) {
    return <div className="text-center text-xl mt-8">Carregando...</div>;
  }

  if (error || !music) {
    return <div className="text-center text-red-500 text-xl mt-8">{error || 'Música não encontrada.'}</div>;
  }

  const handleTranspose = (change: number) => {
    setSemitoneChange(prev => {
      return prev + change;
    });
  };
  const handleFontSizeChange = (change: number) => setFontSize(prev => Math.max(10, prev + change));

  const handleDeleteMusic = async () => {
    if (window.confirm('Tem certeza que deseja apagar esta música?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        await deleteMusic(music.id);
        router.push(`/artists/${music.artist.id}`);
      } catch (err) {
        console.error('Falha ao apagar música:', err);
        alert('Erro ao apagar música.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para favoritar músicas.');
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || !user || !currentUserId) return; // Add currentUserId check here

    try {
      if (isFavorited) {
        await removeFavoriteMusic(currentUserId, music.id);
      } else {
        await addFavoriteMusic(currentUserId, music.id);
      }
      setIsFavorited(prev => !prev);
    } catch (err) {
      console.error('Falha ao alternar favorito:', err);
      alert('Erro ao alternar favorito.');
    }
  };

  

  const transposedContent = transposeContent(music.content, semitoneChange);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Header */}
          <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    {music.artist.photoUrl ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={music.artist.photoUrl} alt={music.artist.name} fill style={{ objectFit: 'cover' }} sizes="64px" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-[var(--color-card-background)] flex items-center justify-center flex-shrink-0 border border-[var(--color-border)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold">{music.title}</h1>
                        <Link href={`/artists/${music.artist.id}`} className="text-xl sm:text-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">{music.artist.name}</Link>
                        {/* Tags Section */}
                        {music.tags && music.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {music.tags.map((musicTag) => (
                                    <Link href={`/tags/${musicTag.tag.name.toLowerCase()}`} key={musicTag.tag.id} className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs px-2 py-1 rounded-full hover:bg-[var(--color-primary)]/40 transition-colors">
                                        {musicTag.tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
           <div className="flex flex-col sm:flex-row gap-2 items-center">
                {isLoggedIn && (
                  <>
                    {/* Botão Favoritar */}
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-full transition-colors ${isFavorited ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:bg-gray-500/20'}`}
                      aria-label="Adicionar aos favoritos"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 
                            6.343l1.172-1.171a4 4 0 115.656 5.656L10 
                            17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Botão Add to Playlist */}
                    <button
                      onClick={() => setShowAddToPlaylistModal(true)}
                      className="p-2 rounded-full transition-colors text-gray-400 hover:bg-gray-500/20"
                      aria-label="Adicionar à playlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 
                                7a1 1 0 011-1h10a1 1 0 110 
                                2H5a1 1 0 01-1-1zM2 11a1 1 0 
                                011-1h14a1 1 0 110 2H3a1 1 0 
                                01-1-1z" />
                      </svg>
                    </button>
                  </>
                )}

                {isLoggedIn && user?.role === 'ADMIN' && (
                  <button
                    onClick={handleDeleteMusic}
                    className="btn-destructive text-sm px-3 py-2"
                  >
                    Apagar
                  </button>
                )}
              </div>

            </div>
          </header>

          {/* Main Content */}
          <main className="bg-[var(--color-card-background)] p-4 sm:p-6 rounded-lg shadow-lg border border-[var(--color-border)]">
            
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">Tom: {music.tone}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-center mb-1">Tom</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleTranspose(-1)} className="control-btn">-1</button>
                    <button onClick={() => handleTranspose(1)} className="control-btn">+1</button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-center mb-1">Fonte</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleFontSizeChange(-2)} className="control-btn">A-</button>
                    <button onClick={() => handleFontSizeChange(2)} className="control-btn">A+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chord Display */}
            {music.content ? (
              <ChordInteractiveDisplay content={transposedContent} fontSize={fontSize} initialTone={music.tone} semitoneChange={semitoneChange} />
            ) : (
              <p className="p-4 text-center">Cifra não disponível.</p>
            )}
          </main>

          {/* Comments Section */}
                              <section className="mt-8">
            <CommentSection musicId={music.id} currentUserId={currentUserId} isAdmin={isAdmin} />
          </section>
        </div>

        {/* Right Column (Video) */}
        <div className="lg:col-span-1">
          {music.videoUrl && (
            <section className="lg:sticky lg:top-8 mt-8 lg:mt-0">
              <h3 className="text-2xl font-bold mb-4">Vídeo Tutorial</h3>
              <YouTubeEmbed videoUrl={music.videoUrl} />
            </section>
          )}
        </div>

      </div>

      {/* Chord Tooltip */}
      

      {showAddToPlaylistModal && (
        <AddToPlaylistModal
          musicId={music.id}
          onClose={() => setShowAddToPlaylistModal(false)}
        />
      )}
    </div>
  );
}
