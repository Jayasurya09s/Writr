import axios, { AxiosInstance, AxiosError } from 'axios';

// Use environment variable or fallback to production backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://syncdraft-ai.onrender.com';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?.headers?.['X-Retry']) {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          if (originalRequest) {
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            originalRequest.headers['X-Retry'] = 'true';
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  signup: (email: string, password: string, full_name: string) =>
    api.post('/auth/signup', { email, password, full_name }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
};

// Posts API endpoints
export const postsAPI = {
  create: (title: string, content: string, html_content?: string) =>
    api.post('/api/posts/', { title, content, html_content }),
  
  list: () => api.get('/api/posts/'),

  getPublic: () =>
    publicAPI.getPublishedPosts(),
  
  getById: (postId: string) =>
    api.get(`/api/posts/${postId}`),
  
  update: (postId: string, data: { title?: string; content?: string; html_content?: string }) =>
    api.patch(`/api/posts/${postId}`, data),
  
  delete: (postId: string) => api.delete(`/api/posts/${postId}`),
  
  publish: (postId: string) =>
    api.post(`/api/posts/${postId}/publish`, {}),
  
  unpublish: (postId: string) =>
    api.post(`/api/posts/${postId}/unpublish`, {}),
};

// Comments API endpoints
export const commentsAPI = {
  listByPost: (postId: string) =>
    api.get(`/api/public/posts/${postId}/comments`),
  
  create: (postId: string, body: string) =>
    api.post(`/api/posts/${postId}/comments`, { body }),
  
  delete: (postId: string, commentId: string) =>
    api.delete(`/api/posts/${postId}/comments/${commentId}`),
};

// AI API endpoints
export const aiAPI = {
  generate: (text: string, mode: 'summary' | 'grammar') =>
    api.post('/api/ai/generate', { text, mode }),
  
  generateSummary: (text: string) =>
    api.post('/api/ai/generate', { text, mode: 'summary' }),
  
  generateTitle: (text: string) =>
    api.post('/api/ai/generate', { text, mode: 'summary' }),
};

// Public endpoints (no auth required)
export const publicAPI = {
  getPublishedPosts: () =>
    axios.get(`${API_BASE_URL}/api/public/posts`),
  
  getPublishedPost: (postId: string) =>
    axios.get(`${API_BASE_URL}/api/public/posts/${postId}`),
  
  getPostComments: (postId: string) =>
    axios.get(`${API_BASE_URL}/api/public/posts/${postId}/comments`),
};

// User profile API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (data: { full_name?: string; bio?: string }) =>
    api.patch('/users/profile', data),
};

export default api;
