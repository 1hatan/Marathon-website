import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('infinity_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401/403 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!window.location.pathname.startsWith('/admin/login')) {
        localStorage.removeItem('infinity_admin_token');
        localStorage.removeItem('infinity_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const adminLogin = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// Event Settings
export const fetchSettings = async () => {
  const res = await api.get('/settings');
  return res.data;
};

export const updateSettings = async (data) => {
  const res = await api.put('/settings', data);
  return res.data;
};

// Race Categories
export const fetchRaces = async () => {
  const res = await api.get('/races');
  return res.data;
};

export const createRace = async (data) => {
  const res = await api.post('/races', data);
  return res.data;
};

export const updateRace = async (id, data) => {
  const res = await api.put(`/races/${id}`, data);
  return res.data;
};

export const deleteRace = async (id) => {
  const res = await api.delete(`/races/${id}`);
  return res.data;
};

// Sponsors
export const fetchSponsors = async (isAdmin = false) => {
  const res = await api.get(`/sponsors${isAdmin ? '?admin=true' : ''}`);
  return res.data;
};

export const createSponsor = async (data) => {
  const res = await api.post('/sponsors', data);
  return res.data;
};

export const updateSponsor = async (id, data) => {
  const res = await api.put(`/sponsors/${id}`, data);
  return res.data;
};

export const deleteSponsor = async (id) => {
  const res = await api.delete(`/sponsors/${id}`);
  return res.data;
};

// Gallery
export const fetchGallery = async (isAdmin = false) => {
  const res = await api.get(`/gallery${isAdmin ? '?admin=true' : ''}`);
  return res.data;
};

export const createGallery = async (data) => {
  const res = await api.post('/gallery', data);
  return res.data;
};

export const updateGallery = async (id, data) => {
  const res = await api.put(`/gallery/${id}`, data);
  return res.data;
};

export const deleteGallery = async (id) => {
  const res = await api.delete(`/gallery/${id}`);
  return res.data;
};

// FAQ
export const fetchFaqs = async (isAdmin = false) => {
  const res = await api.get(`/faq${isAdmin ? '?admin=true' : ''}`);
  return res.data;
};

export const createFaq = async (data) => {
  const res = await api.post('/faq', data);
  return res.data;
};

export const updateFaq = async (id, data) => {
  const res = await api.put(`/faq/${id}`, data);
  return res.data;
};

export const deleteFaq = async (id) => {
  const res = await api.delete(`/faq/${id}`);
  return res.data;
};

// Contact Form & Messages
export const submitContact = async (data) => {
  const res = await api.post('/contact', data);
  return res.data;
};

export const fetchContactMessages = async () => {
  const res = await api.get('/contact');
  return res.data;
};

export const updateContactStatus = async (id, status) => {
  const res = await api.put(`/contact/${id}`, { status });
  return res.data;
};

export const deleteContactMessage = async (id) => {
  const res = await api.delete(`/contact/${id}`);
  return res.data;
};

// Registrations / Participants
export const submitRegistration = async (data) => {
  const res = await api.post('/participants', data);
  return res.data;
};

export const fetchParticipantById = async (id) => {
  const res = await api.get(`/participants/${id}`);
  return res.data;
};

export const fetchParticipants = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/participants?${query}`);
  return res.data;
};

export const updateParticipant = async (id, data) => {
  const res = await api.put(`/participants/${id}`, data);
  return res.data;
};

export const deleteParticipant = async (id) => {
  const res = await api.delete(`/participants/${id}`);
  return res.data;
};

// Dashboard Stats
export const fetchDashboardStats = async () => {
  const res = await api.get('/dashboard/stats');
  return res.data;
};

export default api;
