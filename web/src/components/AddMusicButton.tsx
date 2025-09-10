'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

interface AddMusicButtonProps {
  artistId: string;
}

interface User {
  role: string;
}

export default function AddMusicButton({ artistId }: AddMusicButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user: User = JSON.parse(userData);
      setIsAdmin(user.role === 'ADMIN');
    }
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="my-6">
      <Link href={`/artists/${artistId}/music/new`}>
        <div className="inline-flex items-center bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <FaPlus className="mr-2" /> Adicionar Nova Música
        </div>
      </Link>
    </div>
  );
}