'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserCircle, FaTags, FaUser, FaHeart, FaList, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';

interface User {
  name: string;
  email: string;
  role: string;
  profilePhotoUrl?: string;
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    handleAuthChange(); // Initial check

    window.addEventListener('auth-change', handleAuthChange);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (user) {
    const isAdmin = user.role === 'ADMIN';
    return (
      <div className="flex items-center gap-4 relative">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user.profilePhotoUrl ? (
              <Image src={user.profilePhotoUrl} alt="Profile" width={40} height={40} className="rounded-full border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-card-background)] flex items-center justify-center border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
                <FaUserCircle className="h-6 w-6 text-[var(--color-text-secondary)]" />
              </div>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card-background)] rounded-md shadow-lg py-1 z-10 border border-[var(--color-border)]">
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">{user.email}</p>
              </div>
              <div className="border-t border-[var(--color-border)]"></div>
              {isAdmin && (
                <>
                  <Link href="/categories">
                    <div className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] flex items-center gap-2">
                      <MdCategory /> Gerenciar Categorias
                    </div>
                  </Link>
                  <Link href="/tags">
                    <div className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] flex items-center gap-2">
                      <FaTags /> Gerenciar Tags
                    </div>
                  </Link>
                  <div className="border-t border-[var(--color-border)]"></div>
                </>
              )}
              <Link href="/profile">
                <div className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] flex items-center gap-2">
                  <FaUser /> Meu Perfil
                </div>
              </Link>
              <Link href="/my-favorites">
                <div className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] flex items-center gap-2">
                  <FaHeart /> Minhas Cifras Favoritas
                </div>
              </Link>
              <Link href="/my-playlists">
                <div className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] flex items-center gap-2">
                  <FaList /> Minhas Playlists
                </div>
              </Link>
              <div className="border-t border-[var(--color-border)]"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-[var(--color-destructive)] hover:bg-[var(--color-background)] flex items-center gap-2"
              >
                <FaSignOutAlt /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <div className="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-transparent border border-[var(--color-border)] rounded-md hover:bg-[var(--color-hover)] transition-colors flex items-center gap-2">
          <FaSignInAlt /> Login
        </div>
      </Link>
      <Link href="/register">
        <div className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] border border-transparent rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2">
          <FaUserPlus /> Cadastrar
        </div>
      </Link>
    </div>
  );
}
