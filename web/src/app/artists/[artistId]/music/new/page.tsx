'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createMusic, getTags } from '@/services/api';

interface Tag {
  id: string;
  name: string;
}

export default function NewMusicPage() {
  const router = useRouter();
  const params = useParams();
  const { artistId } = params;

  const [title, setTitle] = useState('');
  const [tone, setTone] = useState('');
  const [videoUrl, setVideoUrl] = useState(''); // Changed from youtubeUrl
  const [content, setContent] = useState(''); // For chords and lyrics
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTags = async () => {
      try {
        const response = await getTags();
        setTags(response.data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
        setError('Falha ao carregar tags.');
      }
    };

    fetchTags();
  }, [router]);

  const handleTagChange = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const musicData = {
      title,
      tone,
      videoUrl,
      content,
      artistId: artistId as string,
      tagIds: selectedTagIds,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await createMusic(musicData, token);
      router.push(`/music/${response.data.id}`);
    } catch (err) {
      setError('Falha ao criar música. Verifique os dados.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Adicionar Nova Música</h1>
      <form onSubmit={handleSubmit} className="bg-[var(--color-card-background)] p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-bold mb-2">Título</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-bold mb-2">Tom</label>
            <input type="text" id="tone" value={tone} onChange={(e) => setTone(e.target.value)} required className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="videoUrl" className="block text-sm font-bold mb-2">URL do Vídeo (Opcional)</label>
          <input type="url" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-bold mb-2">Cifra e Letra</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={15} className="w-full p-2 rounded bg-[var(--color-background)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono" placeholder="Use <b></b> para marcar os acordes. Ex: <b>G</b>\nPrimeira linha da música..."></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Tags</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="mr-2 h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)] rounded"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="text-sm">{tag.name}</label>
                </div>
              ))
            ) : (
              <p className="col-span-full text-sm text-[var(--color-text-secondary)]">Nenhuma tag disponível. Crie algumas tags primeiro.</p>
            )}
          </div>
        </div>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <button type="submit" className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white font-bold py-2 px-4 rounded-lg">
          Salvar Música
        </button>
      </form>
    </div>
  );
}