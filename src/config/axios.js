import axios from 'axios';

// Determine the API base URL based on environment
// In development, we might use a proxy or localhost address
// const BASE_URL = process.env.NODE_ENV === 'production' 
  // ? 'https://your-production-api-url.com' // Replace with your production API URL
  // : 'http://localhost:1909'; // Replace with your development backend port

// Create axios instance with custom configuration
const api = axios.create({
  baseURL: 'http://localhost:1909',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  config => {
    // Get token from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling common errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 