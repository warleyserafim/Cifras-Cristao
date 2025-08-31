'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getMusic } from '@/services/api'; // Assuming getMusic is needed here

interface Music {
  id: string;
  title: string;
  artist: { name: string };
}

interface SearchInputWithDropdownProps {
  initialSearchQuery?: string;
}

const SearchInputWithDropdown: React.FC<SearchInputWithDropdownProps> = ({ initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearchQuery);
  const [musicResults, setMusicResults] = useState<Music[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false); // Local loading state for search
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Effect for debouncing search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Debounce for 300ms

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Effect for fetching music results based on debounced query
  useEffect(() => {
    const fetchMusicSearchResults = async () => {
      if (debouncedSearchQuery) {
        setLoading(true);
        try {
          const response = await getMusic(undefined, debouncedSearchQuery);
          setMusicResults(response.data);
        } catch (err) {
          console.error('Failed to fetch music search results:', err);
          setMusicResults([]); // Clear results on error
        } finally {
          setLoading(false);
        }
      } else {
        setMusicResults([]); // Clear music results if search query is empty
      }
    };

    fetchMusicSearchResults();
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle clicks outside the search input and dropdown to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        const dropdownElement = document.getElementById('search-dropdown');
        if (dropdownElement && dropdownElement.contains(event.target as Node)) {
          return;
        }
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchInputRef]);

  return (
    <div className="relative max-w-lg mx-auto mb-12">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Qual música você quer tocar hoje?"
        className="w-full p-4 rounded-full bg-[var(--color-card-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text-primary)]"
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && searchQuery && (musicResults.length > 0 || loading) && (
        <div
          id="search-dropdown"
          className="absolute z-10 w-full bg-[var(--color-card-background)] border border-[var(--color-border)] rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto text-left"
        >
          {loading ? (
            <div className="p-3 text-[var(--color-text-secondary)]">Carregando...</div>
          ) : musicResults.length > 0 ? (
            musicResults.map((music) => (
              <Link key={music.id} href={`/music/${music.id}`}>
                <div className="flex items-center p-3 hover:bg-[var(--color-primary-light)] cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M9 19V6l12-3v13m-6 0V9" />
                  </svg>
                  <div>
                    <div className="font-semibold text-[var(--color-text-primary)]">{music.title}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{music.artist.name}</div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-3 text-[var(--color-text-secondary)]">Nenhuma música encontrada para &quot;{searchQuery}&quot;.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInputWithDropdown;