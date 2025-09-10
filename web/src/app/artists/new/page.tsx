'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createArtist, getCategories } from '@/services/api';

interface Category {
  id: string;
  name: string;
}

export default function NewArtistPage() {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategoryId(response.data[0].id); // Select first category by default
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Falha ao carregar categorias.');
      }
    };

    fetchCategories();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await createArtist({ name, photoUrl, categoryId: selectedCategoryId });
      router.push(`/artists/${response.data.id}`);
    } catch (err) {
      setError('Falha ao criar artista. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Cadastrar Novo Artista</h1>
      <form onSubmit={handleSubmit} className="bg-[var(--color-card-background)] p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">Nome do Artista</label>
          <input 
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="photoUrl" className="block text-sm font-bold mb-2">URL da Foto (Opcional)</label>
          <input 
            type="url"
            id="photoUrl"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-bold mb-2">Categoria</label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            required
            className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))
            ) : (
              <option value="">Carregando categorias...</option>
            )}
          </select>
        </div>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <button type="submit" className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Salvar Artista
        </button>
      </form>
    </div>
  );
}