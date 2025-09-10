
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCommentsByMusicId, createComment, deleteComment } from '../services/api';
import { FaTrashAlt, FaPaperPlane } from 'react-icons/fa';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface CommentSectionProps {
  musicId: string;
}

interface User {
  id: string;
  role: string;
  name: string;
}

export default function CommentSection({ musicId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await getCommentsByMusicId(musicId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [musicId]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const tokenData = localStorage.getItem('token');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (tokenData) {
      setToken(tokenData);
    }
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    try {
      const response = await createComment({ musicId, content: newComment }, token);
      // Assuming the response.data contains the full comment object with user info
      const newCommentData = { ...response.data, user: { id: user!.id, name: user!.name } };
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
        try {
        await deleteComment(commentId, token);
        setComments(comments.filter((comment) => comment.id !== commentId));
        } catch (error) {
        console.error('Error deleting comment:', error);
        }
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
      <h3 className="text-2xl font-bold mb-4">Comentários</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-[var(--color-text-primary)]">{comment.user.name}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
              {(user?.role === 'ADMIN' || user?.id === comment.user.id) && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <FaTrashAlt /> Excluir
                </button>
              )}
            </div>
            <p className="mt-2 text-[var(--color-text-primary)] whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className="w-full p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition"
            rows={4}
          />
          <button type="submit" className="btn btn-primary mt-3 flex items-center gap-2">
            <FaPaperPlane /> Enviar Comentário
          </button>
        </form>
      )}
    </div>
  );
}
