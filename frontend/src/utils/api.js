import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth Endpoints ──────────────────────────────────────────
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const getMe         = ()     => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/update', data);

// ── Task Endpoints ──────────────────────────────────────────
export const getTasks       = (params) => API.get('/tasks', { params });
export const getTask        = (id)     => API.get(`/tasks/${id}`);
export const createTask     = (data)   => API.post('/tasks', data);
export const updateTask     = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask     = (id)     => API.delete(`/tasks/${id}`);
export const toggleTask     = (id)     => API.patch(`/tasks/${id}/toggle`);
export const getTaskStats   = ()       => API.get('/tasks/stats');

export default API;
