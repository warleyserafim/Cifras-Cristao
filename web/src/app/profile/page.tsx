'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser } from '@/services/api';
import Image from 'next/image';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePhotoUrl?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newProfilePhotoUrl, setNewProfilePhotoUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    const currentUser: UserData = JSON.parse(storedUser);

    const fetchUser = async () => {
      try {
        const response = await getUserById(currentUser.id);
        setUser(response.data);
        setNewName(response.data.name || '');
        setNewProfilePhotoUrl(response.data.profilePhotoUrl || '');
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Falha ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const updatedData = {
        name: newName,
        profilePhotoUrl: newProfilePhotoUrl,
      };

      const response = await updateUser(user.id, updatedData);
      setUser(response.data); // Update local state with new data
      localStorage.setItem('user', JSON.stringify(response.data)); // Update localStorage
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Falha ao atualizar perfil.');
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Carregando perfil...</div>;
  }

  if (error || !user) {
    return <div className="text-center text-red-500 text-xl mt-8">{error || 'Perfil não encontrado.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-[var(--color-card-background)] p-8 rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold text-center mb-6">Meu Perfil</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--color-border)] mb-4">
          {user.profilePhotoUrl ? (
            <Image 
              src={user.profilePhotoUrl}
              alt={user.name || 'User'}
              fill
              style={{ objectFit: 'cover' }}
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-background)] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--color-text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold">{user.name || 'Usuário'}</h2>
        <p className="text-[var(--color-text-secondary)]">{user.email}</p>
        <p className="text-[var(--color-text-secondary)] text-sm">Função: {user.role}</p>
      </div>

      {!isEditing ? (
        <div className="text-center">
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className="w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-bold mb-2">Nome</label>
            <input 
              type="text"
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePhotoUrl" className="block text-sm font-bold mb-2">URL da Foto de Perfil (Opcional)</label>
            <input 
              type="url"
              id="profilePhotoUrl"
              value={newProfilePhotoUrl}
              onChange={(e) => setNewProfilePhotoUrl(e.target.value)}
              className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
