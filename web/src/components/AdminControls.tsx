'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  role: string;
}

export default function AdminControls() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user: User = JSON.parse(userData);
      setIsAdmin(user.role === 'ADMIN');
    }
  }, []);

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="my-6 text-center">
      <Link href="/artists/new">
        <div className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          + Adicionar Novo Artista
        </div>
      </Link>
    </div>
  );
}