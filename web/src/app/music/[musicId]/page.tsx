'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMusicById, deleteMusic, addFavoriteMusic, removeFavoriteMusic, getFavoriteMusic } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import ChordTooltip from '@/components/ChordTooltip';

import { useParams } from 'next/navigation';

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

// --- Transpose Logic ---
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const transposeChord = (chord: string, semitones: number): string => {
  if (!chord) return '';

  const parts = chord.match(/([A-G][#b]?)(m|maj|min|sus|add|dim|aug)?[0-9]*(?:[A-G][#b]?)?/);
  if (!parts) return chord;

  const root = parts[1];
  const suffix = parts[2] || '';
  const other = chord.substring(root.length + suffix.length);

  let rootIndex = NOTES.indexOf(root);
  if (rootIndex === -1) {
    if (root.includes('b')) {
      const sharpEquivalent = NOTES[NOTES.indexOf(root.replace('b', '')) - 1];
      rootIndex = NOTES.indexOf(sharpEquivalent);
    } else {
      return chord;
    }
  }

  let newIndex = (rootIndex + semitones) % NOTES.length;
  if (newIndex < 0) newIndex += NOTES.length;

  return NOTES[newIndex] + suffix + other;
};

const transposeContent = (content: string, semitones: number): string => {
  if (semitones === 0) return content;

  return content.replace(/<b>(.*?)<\/b>/g, (match, chord) => {
    const transposedChord = transposeChord(chord, semitones);
    return `<b>${transposedChord}<>`;
  });
};

// --- Component to display Chords and Lyrics ---
const ChordDisplay = ({ content, fontSize, onChordHover, onChordLeave }:
  { content: string; fontSize: number; onChordHover: (chord: string, rect: DOMRect) => void; onChordLeave: () => void }) => {

  const lines = content.split('\n').map((line, index) => {
    const processedLine = line.split(/(<b>.*?<\/b>)/g).map((part, partIndex) => {
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        const chordName = part.replace(/<b>|<\/b>/g, '');
        return (
          <span
            key={partIndex}
            className="font-bold text-[var(--color-primary)] cursor-pointer hover:underline relative"
            onMouseEnter={(e) => onChordHover(chordName, e.currentTarget.getBoundingClientRect())}
            onMouseLeave={onChordLeave}
          >
            {chordName}
          </span>
        );
      } else {
        return <span key={partIndex} className="mr-1">{part}</span>;
      }
    });

    return <div key={index} className="leading-relaxed flex items-end">{processedLine}</div>;
  });

  return (
    <pre
      className="font-mono whitespace-pre-wrap break-words p-4 bg-[var(--color-background)] rounded-md text-[var(--color-text-primary)] text-left"
      style={{ fontSize: `${fontSize}px`, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
    >
      {lines}
    </pre>
  );
};


// --- Component for YouTube Embed ---
const YouTubeEmbed = ({ videoUrl }: { videoUrl: string }) => {
  const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^&?]*).*/);
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
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false); // New state for favorite status
  const [userRole, setUserRole] = useState<string | null>(null);


  // State for Chord Tooltip
  const [hoveredChord, setHoveredChord] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    let currentUserId: string | null = null;

    if (token && storedUser) {
      setIsLoggedIn(true);
      const user = JSON.parse(storedUser);
      currentUserId = user.id;
      setUserRole(user.role);
    } else {
      setIsLoggedIn(false);
    }

    const fetchMusic = async () => {
      try {
        const response = await getMusicById(musicId);
        setMusic(response.data);

        // Check if music is favorited by the current user
        if (currentUserId && token) {
          const favoritesResponse = await getFavoriteMusic(currentUserId, token);
          const favorites: MusicData[] = favoritesResponse.data; // <- agora é array

          setIsFavorited(
            Array.isArray(favorites) &&
            favorites.some((favMusic: MusicData) => favMusic.id === musicId)
          );
        }
        setLoading(false);
      } catch (err) {
        console.error(`Failed to fetch music ${musicId}:`, err);
        setError('Música não encontrada ou erro ao carregar.');
        setLoading(false);
      }
    };
    fetchMusic();
  }, [musicId]);

  if (loading) {
    return <div className="text-center text-xl mt-8">Carregando...</div>;
  }

  if (error || !music) {
    return <div className="text-center text-red-500 text-xl mt-8">{error || 'Música não encontrada.'}</div>;
  }

  const handleTranspose = (change: number) => {
    setSemitoneChange(prev => prev + change);
  };

  const handleFontSizeChange = (change: number) => {
    setFontSize(prev => Math.max(10, prev + change)); // Prevent font size from going too small
  };

  const handleDeleteMusic = async () => {
    if (window.confirm('Tem certeza que deseja apagar esta música?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        await deleteMusic(music.id, token);
        router.push(`/artists/${music.artist.id}`); // Redirect to artist page after deletion
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
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) return; // Should not happen if isLoggedIn is true

    const currentUserId = JSON.parse(storedUser).id;

    try {
      if (isFavorited) {
        await removeFavoriteMusic(currentUserId, music.id, token);
      } else {
        await addFavoriteMusic(currentUserId, music.id, token);
      }
      setIsFavorited(prev => !prev); // Toggle favorite status
    } catch (err) {
      console.error('Falha ao alternar favorito:', err);
      alert('Erro ao alternar favorito.');
    }
  };

  const handleChordHover = (chord: string, rect: DOMRect) => {
    setHoveredChord(chord);
    setTooltipPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
  };

  const handleChordLeave = () => {
    setHoveredChord(null);
    setTooltipPosition(null);
  };

  const transposedContent = transposeContent(music.content, semitoneChange);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main content: Chords and Lyrics */}
      <div className="lg:col-span-2 bg-[var(--color-card-background)] p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between gap-4 mb-4"> 
          <div className="flex items-center gap-4">
            {music.artist.photoUrl ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  src={music.artist.photoUrl}
                  alt={music.artist.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-card-background)] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold">{music.title}</h1>
              <Link href={`/artists/${music.artist.id}`} className="text-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">{music.artist.name}</Link>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {isLoggedIn && (
              <button 
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${isFavorited ? 'text-red-500 hover:bg-red-100' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            {isLoggedIn && userRole === 'ADMIN' && (
              <button onClick={handleDeleteMusic} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                Apagar Música
              </button>
            )}
          </div>
        </div>
        
        <p className="mb-6 text-lg"><span className="font-bold">Tom:</span> {music.tone}</p>
        
        {music.content ? (
          <ChordDisplay content={transposedContent} fontSize={fontSize} onChordHover={handleChordHover} onChordLeave={handleChordLeave} />
        ) : (
          <p className="p-4 bg-[var(--color-background)] rounded-md">Cifra não disponível.</p>
        )}

        {/* Tags Section */}
        {music.tags && music.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {music.tags.map((musicTag) => (
                <span key={musicTag.tag.id} className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm px-3 py-1 rounded-full">
                  {musicTag.tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right sidebar: Video and Controls */}
      <div className="flex flex-col gap-8">

        {/* YouTube Embed */}
        {music.videoUrl ? (
          <YouTubeEmbed videoUrl={music.videoUrl} />
        ) : (
          <div className="bg-[var(--color-card-background)] p-6 rounded-lg text-center">
            <p>Nenhum vídeo tutorial disponível.</p>
            </div>
          )}

          {/* Controls Section */}
          <div className="bg-[var(--color-card-background)] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Controles</h3>
            <div className="flex flex-col gap-4">

              {/* Transpose Tone */}
              <div>
                <p className="text-md font-medium mb-2">Transpor Tom:</p>
                <div className="flex gap-2">
                  <button onClick={() => handleTranspose(-1)} className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg transition-colors">-1</button>
                  <button onClick={() => handleTranspose(1)} className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg transition-colors">+1</button>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <p className="text-md font-medium mb-2">Tamanho da Fonte:</p>
                <div className="flex gap-2">
                  <button onClick={() => handleFontSizeChange(-2)} className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg transition-colors">A-</button>
                  <button onClick={() => handleFontSizeChange(2)} className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg transition-colors">A+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {hoveredChord && tooltipPosition && (
        <ChordTooltip 
          chordName={hoveredChord}
          position={tooltipPosition}
          onClose={() => setHoveredChord(null)} // Close on internal click or mouseleave from tooltip
        />
      )}
    </div>
  );
}
