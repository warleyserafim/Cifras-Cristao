import axios from 'axios';
import NProgress from 'nprogress';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// Request interceptor to start NProgress
api.interceptors.request.use(
  (config) => {
    NProgress.start();
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Response interceptor to stop NProgress
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    const { config } = response;
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
        toast.success('Operação realizada com sucesso!');
    }
    return response;
  },
  (error) => {
    NProgress.done();
    if (error.response && error.response.status === 401) {
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch a custom event to notify other parts of the app, like AuthButton
      window.dispatchEvent(new CustomEvent('auth-change'));
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Category Endpoints
export const getCategories = () => api.get('/categories');
export const createCategory = (data: { name: string }) => api.post('/categories', data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);

// Tag Endpoints
export const getTags = () => api.get('/tags');
export const createTag = (data: { name: string }) => api.post('/tags', data);
export const deleteTag = (id: string) => api.delete(`/tags/${id}`);

// Artist Endpoints
export const getArtists = (categoryId?: string) => api.get('/artists', { params: { categoryId } });
export const getArtistById = (id: string) => api.get(`/artists/${id}`);
export const createArtist = (data: { name: string; photoUrl?: string; categoryId?: string }) => api.post('/artists', data);
export const deleteArtist = (id: string) => api.delete(`/artists/${id}`);

// Music Endpoints
export const getMusic = (tag?: string, searchQuery?: string) => api.get('/music', { params: { tag, searchQuery } });
export const getMusicById = (id: string) => api.get(`/music/${id}`);
export const createMusic = (data: { title: string; tone: string; content: string; videoUrl?: string; artistId: string; tagIds?: string[] }) => api.post('/music', data);
export const deleteMusic = (id: string) => api.delete(`/music/${id}`);

// User Endpoints
export const getUserById = (id: string) => api.get(`/users/${id}`);
export const updateUser = (id: string, data: { name?: string; email?: string; password?: string; profilePhotoUrl?: string }) => api.put(`/users/${id}`, data);
export const addFavoriteMusic = (userId: string, musicId: string) => api.post(`/users/${userId}/favorites/${musicId}`, {});
export const removeFavoriteMusic = (userId: string, musicId: string) => api.delete(`/users/${userId}/favorites/${musicId}`);
export const getFavoriteMusic = (userId: string) => api.get(`/users/${userId}/favorites`);

// Comment Endpoints
export const getCommentsByMusicId = (musicId: string) => api.get(`/comments/${musicId}`);
export const createComment = (data: { content: string; musicId: string }) => api.post('/comments', data);
export const deleteComment = (commentId: string) => api.delete(`/comments/${commentId}`);

// Playlist Endpoints
export const getUserPlaylists = () => api.get('/playlists');
export const createPlaylist = (data: { name: string }) => api.post('/playlists', data);
export const getPlaylistById = (id: string) => api.get(`/playlists/${id}`);
export const updatePlaylist = (id: string, data: { name: string }) => api.put(`/playlists/${id}`, data);
export const deletePlaylist = (id: string) => api.delete(`/playlists/${id}`);
export const addMusicToPlaylist = (playlistId: string, musicId: string) => api.post(`/playlists/${playlistId}/musics/${musicId}`, {});
export const removeMusicFromPlaylist = (playlistId: string, musicId: string) => api.delete(`/playlists/${playlistId}/musics/${musicId}`);

// Auth Endpoints
export const login = (credentials: Record<string, unknown>) => api.post('/auth/login', credentials);
export const register = (userData: Record<string, unknown>) => api.post('/auth/register', userData);

export default api;
