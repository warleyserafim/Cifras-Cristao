'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register({ name, email, password });
      router.push('/login'); // Redirect to login page on successful registration
    } catch (err) {
      setError('Falha no cadastro. Tente outro email.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Criar Conta</h1>
      <form onSubmit={handleSubmit} className="bg-[var(--color-card-background)] p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">Nome</label>
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
          <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
          <input 
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-bold mb-2">Senha</label>
          <input 
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
