import axios from 'axios';
import NProgress from 'nprogress';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// Request interceptor to start NProgress
api.interceptors.request.use(
  (config) => {
    NProgress.start();
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
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Helper to get headers with auth token
const getAuthHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Category Endpoints
export const getCategories = () => api.get('/categories');
export const createCategory = (data: { name: string }, token: string) => api.post('/categories', data, getAuthHeaders(token));
export const deleteCategory = (id: string, token: string) => api.delete(`/categories/${id}`, getAuthHeaders(token));

// Tag Endpoints
export const getTags = () => api.get('/tags');
export const createTag = (data: { name: string }, token: string) => api.post('/tags', data, getAuthHeaders(token));
export const deleteTag = (id: string, token: string) => api.delete(`/tags/${id}`, getAuthHeaders(token));

// Artist Endpoints
export const getArtists = (categoryId?: string) => api.get('/artists', { params: { categoryId } });
export const getArtistById = (id: string) => api.get(`/artists/${id}`);
export const createArtist = (data: { name: string; photoUrl?: string; categoryId?: string }, token: string) => api.post('/artists', data, getAuthHeaders(token));
export const deleteArtist = (id: string, token: string) => api.delete(`/artists/${id}`, getAuthHeaders(token));

// Music Endpoints
export const getMusic = (tag?: string, searchQuery?: string) => api.get('/music', { params: { tag, searchQuery } });
export const getMusicById = (id: string) => api.get(`/music/${id}`);
export const createMusic = (data: { title: string; tone: string; content: string; videoUrl?: string; artistId: string; tagIds?: string[] }, token: string) => api.post('/music', data, getAuthHeaders(token));
export const deleteMusic = (id: string, token: string) => api.delete(`/music/${id}`, getAuthHeaders(token));

// User Endpoints
export const getUserById = (id: string, token: string) => api.get(`/users/${id}`, getAuthHeaders(token));
export const updateUser = (id: string, data: { name?: string; email?: string; password?: string; profilePhotoUrl?: string }, token: string) => api.put(`/users/${id}`, data, getAuthHeaders(token));
export const addFavoriteMusic = (userId: string, musicId: string, token: string) => api.post(`/users/${userId}/favorites/${musicId}`, {}, getAuthHeaders(token)); // New
export const removeFavoriteMusic = (userId: string, musicId: string, token: string) => api.delete(`/users/${userId}/favorites/${musicId}`, getAuthHeaders(token)); // New
export const getFavoriteMusic = (userId: string, token: string) => api.get(`/users/${userId}/favorites`, getAuthHeaders(token)); // New

// Comment Endpoints
export const getCommentsByMusicId = (musicId: string) => api.get(`/comments/${musicId}`);
export const createComment = (data: { content: string; musicId: string }, token: string) => api.post('/comments', data, getAuthHeaders(token));
export const deleteComment = (commentId: string, token: string) => api.delete(`/comments/${commentId}`, getAuthHeaders(token));

// Auth Endpoints

// Auth Endpoints
export const login = (credentials: Record<string, unknown>) => api.post('/auth/login', credentials);
export const register = (userData: Record<string, unknown>) => api.post('/auth/register', userData);

export default api;