import axios from 'axios';
import { getToken } from '../utils/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1909',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.userType);
    }
    return response;
  },
  signup: (userData) => api.post('/users/signup', userData),
  verifyToken: () => api.get('/profile'),
  // Password reset endpoints
  requestPasswordReset: (email) => api.post('/users/reset-password-request', { email }),
  resetPassword: (token, newPassword) => api.post('/users/reset-password', { token, newPassword }),
  // Change password (for logged-in users)
  updatePassword: (passwordData) => api.put('/profile/password', passwordData)
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Landlord API calls
export const landlordAPI = {
  getDashboard: () => api.get('/landlord/dashboard'),
  getProperties: () => api.get('/properties'),
  addProperty: (propertyData) => api.post('/properties', propertyData),
  updateProperty: (propertyId, data) => api.put(`/properties/${propertyId}`, data),
  deleteProperty: (propertyId) => api.delete(`/properties/${propertyId}`),
  getTenantRequests: () => api.get('/visit-properties'),
  updateTenantRequest: (requestId, status) => api.put(`/visit-properties/${requestId}`, { status })
};

// Tenant API calls
export const tenantAPI = {
  getDashboard: () => api.get('/tenant/dashboard'),
  searchProperties: (filters) => api.get('/properties', { params: filters }),
  submitRequest: (propertyId) => api.post('/visit-properties', { propertyId }),
  getMyRequests: () => api.get('/visit-properties'),
  getMyBookings: () => api.get('/visit-properties')
};

// Property API calls
export const propertyAPI = {
  getAllProperties: () => api.get('/properties'),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (propertyData) => api.post('/properties', propertyData),
  updateProperty: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  deleteProperty: (id) => api.delete(`/properties/${id}`)
};

// Visit Property API calls
export const visitPropertyAPI = {
  scheduleVisit: (visitData) => api.post('/visit-properties', visitData),
  getAllVisits: () => api.get('/visit-properties'),
  getVisitById: (id) => api.get(`/visit-properties/${id}`),
  updateVisitStatus: (id, status) => api.put(`/visit-properties/${id}`, { status })
};

// Image API calls
export const imageAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (id) => api.delete(`/images/${id}`)
};

export default api;