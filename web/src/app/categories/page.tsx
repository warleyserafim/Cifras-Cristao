'use client';

import { useState, useEffect } from 'react';
import { getCategories, deleteCategory } from '@/services/api';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar categorias.');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar esta categoria?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        await deleteCategory(id, token);
        setCategories(categories.filter(c => c.id !== id));
      } catch (err) {
        alert('Falha ao apagar categoria.');
      }
    }
  };

  if (loading) return <div className="text-center">Carregando...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
        <Link href="/categories/new">
          <button className="btn btn-primary">
            Criar Nova Categoria
          </button>
        </Link>
      </div>
      <div className="bg-[var(--color-card-background)] shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[var(--color-background)]">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Nome</th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {categories.map(category => (
              <tr key={category.id} className="hover:bg-[var(--color-background)] transition-colors">
                <td className="py-4 px-6 whitespace-nowrap">{category.name}</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-destructive"
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
