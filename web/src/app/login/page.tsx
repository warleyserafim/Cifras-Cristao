 'use client'; // This marks the component as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login({ email, password });
      // In a real app, you'd store the token more securely
      // and likely use a global state management solution (like Context API)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new CustomEvent('auth-change'));
      router.push('/'); // Redirect to home page on successful login
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Login</h1>
      <form onSubmit={handleSubmit} className="bg-[var(--color-card-background)] p-8 rounded-lg shadow-lg">
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
          Entrar
        </button>
      </form>
    </div>
  );
}
