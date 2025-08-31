'use client';

import { useState, useEffect } from 'react';
import { getTags, deleteTag } from '@/services/api';
import Link from 'next/link';

interface Tag {
  id: string;
  name: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchTagsData = async () => {
    try {
      setLoading(true);
      const response = await getTags();
      setTags(response.data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError('Falha ao carregar tags.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }
    fetchTagsData();
  }, []);

  const handleDeleteTag = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar esta tag?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        await deleteTag(id, token);
        fetchTagsData(); // Refresh the list
      } catch (err) {
        console.error('Falha ao apagar tag:', err);
        alert('Erro ao apagar tag.');
      }
    }
  };

  if (loading) {
    return <div className="text-center">Carregando tags...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Tags</h1>
        {userRole === 'ADMIN' && (
          <Link href="/tags/new">
            <button className="btn btn-primary">
              Criar Nova Tag
            </button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <div key={tag.id} className="bg-[var(--color-card-background)] p-4 rounded-lg shadow-lg flex flex-col justify-between items-center text-center">
              <h2 className="text-xl font-semibold mb-4">{tag.name}</h2>
              {userRole === 'ADMIN' && (
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="btn btn-destructive text-sm"
                >
                  Apagar
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-[var(--color-text-secondary)]">Nenhuma tag encontrada.</p>
        )}
      </div>
    </div>
  );
}
