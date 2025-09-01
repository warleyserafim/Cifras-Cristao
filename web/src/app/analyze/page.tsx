'use client';

import { useState, useEffect, useRef } from 'react';
import { analyzeMusic } from '@/services/api';
import axios from 'axios';
import YouTube from 'react-youtube';
import GuitarChordDiagram from '@/components/GuitarChordDiagram';
import { CHORD_DIAGRAMS } from '@/utils/chordDiagrams';

interface ChordData {
  time: number;
  chord: string;
}

interface AnalysisResult {
  title: string;
  artist: string;
  chords: ChordData[];
  syncedLyrics: string;
  plainLyrics: string;
}

// 1. Chord Timeline Component (Now with proper diagrams)
const ChordTimeline = ({ chords, currentTime }: { chords: ChordData[]; currentTime: number }) => {
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const chordRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let newActiveIndex = -1;
    for (let i = chords.length - 1; i >= 0; i--) {
      if (currentTime >= chords[i].time) {
        newActiveIndex = i;
        break;
      }
    }
    setActiveChordIndex(newActiveIndex);
  }, [currentTime, chords]);

  useEffect(() => {
    if (activeChordIndex !== -1 && chordRefs.current[activeChordIndex]) {
      chordRefs.current[activeChordIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeChordIndex]);

  return (
    <div className="bg-gray-900/80 p-4 rounded-lg overflow-hidden">
      <div className="flex items-center gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        {chords.map((chord, i) => {
          const diagramData = CHORD_DIAGRAMS[chord.chord]?.guitar;
          return (
            <div key={i} ref={el => chordRefs.current[i] = el} className="flex-shrink-0 w-32 h-40">
              <div className={`w-full h-full p-2 border-2 rounded-lg transition-all duration-200 text-center ${i === activeChordIndex ? 'bg-orange-500 border-orange-400 scale-105' : 'bg-gray-700 border-gray-600'}`}>
                <span className="text-lg font-bold">{chord.chord}</span>
                {diagramData ? (
                  <GuitarChordDiagram diagram={diagramData} />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs">Diagram not found</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Main Player Component
const AnalysisPlayer = ({ result, videoId }: { result: AnalysisResult; videoId: string }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const pollTime = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const time = playerRef.current.getCurrentTime();
        if (time) {
          setCurrentTime(time);
        }
      }
    }, 250);

    return () => {
      clearInterval(pollTime);
    };
  }, []);

  const onReady = (event: any) => {
    playerRef.current = event.target;
  };

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
      {/* Left Column: Video Player */}
      <div className="mb-6 lg:mb-0">
        <div className="aspect-video sticky top-4 bg-black rounded-lg shadow-lg">
          <YouTube videoId={videoId} onReady={onReady} className="w-full h-full" opts={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* Right Column: Timeline and Lyrics */}
      <div>
        <div className="mb-4">
          <ChordTimeline chords={result.chords} currentTime={currentTime} />
        </div>
        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Lyrics</h3>
          <pre className="text-lg whitespace-pre-wrap font-sans leading-relaxed">{result.plainLyrics}</pre>
        </div>
      </div>
    </div>
  );
};


export default function AnalyzePage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL.');
      return;
    }

    try {
      const url = new URL(youtubeUrl);
      const id = url.searchParams.get('v');
      if (!id) {
        setError('Invalid YouTube URL. Could not find video ID.');
        return;
      }
      setVideoId(id);

      setLoading(true);
      setError(null);
      setAnalysisResult(null);

      const response = await analyzeMusic(youtubeUrl);
      setAnalysisResult(response.data);
    } catch (err: unknown) {
      console.error('Error analyzing music:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to analyze music. Please check the URL and try again.');
      } else if (err instanceof Error && err.message.includes('Invalid URL')) {
        setError('Invalid URL format. Please enter a full YouTube URL.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Music Analysis Player</h1>

      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10 mb-6 max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-300 mb-2">
            YouTube Music Video URL:
          </label>
          <input
            type="url"
            id="youtubeUrl"
            className="w-full p-3 rounded-lg bg-gray-900/80 border border-white/10 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        </div>
        <button
          onClick={handleAnalyze}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 active:scale-95 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze & Play'}
        </button>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </div>

      {analysisResult && videoId && (
        <AnalysisPlayer result={analysisResult} videoId={videoId} />
      )}
    </div>
  );
}