import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// News API
export const newsAPI = {
  getAll: () => api.get('/news'),
  getBreaking: () => api.get('/news/breaking'),
  getFeatured: () => api.get('/news/featured'),
  getTrending: () => api.get('/news/trending'),
  getByCategory: (categoryId: number) => api.get(`/news/category/${categoryId}`),
  getOne: (id: number) => api.get(`/news/${id}`),
  create: (data: any) => api.post('/news', data),
  update: (id: number, data: any) => api.put(`/news/${id}`, data),
  delete: (id: number) => api.delete(`/news/${id}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getOne: (id: number) => api.get(`/categories/${id}`),
  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Photo API
export const photoAPI = {
  getAll: () => api.get('/photos'),
  getOne: (id: number) => api.get(`/photos/${id}`),
  create: (data: any) => api.post('/photos', data),
  update: (id: number, data: any) => api.put(`/photos/${id}`, data),
  delete: (id: number) => api.delete(`/photos/${id}`),
};

// Video API
export const videoAPI = {
  getAll: () => api.get('/videos'),
  getOne: (id: number) => api.get(`/videos/${id}`),
  create: (data: any) => api.post('/videos', data),
  update: (id: number, data: any) => api.put(`/videos/${id}`, data),
  delete: (id: number) => api.delete(`/videos/${id}`),
};

// Ad API
export const adAPI = {
  getAll: () => api.get('/ads'),
  getByPosition: (position: string) => api.get(`/ads?position=${position}`),
  getOne: (id: number) => api.get(`/ads/${id}`),
  create: (data: any) => api.post('/ads', data),
  update: (id: number, data: any) => api.put(`/ads/${id}`, data),
  delete: (id: number) => api.delete(`/ads/${id}`),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
};

// Admin API
export const adminAPI = {
  login: (username: string, password: string) => api.post('/admin/login', { username, password }),
  register: (data: any) => api.post('/admin/register', data),
};
