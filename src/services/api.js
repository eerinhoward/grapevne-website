import axios from 'axios';
import { getIdToken } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Allow cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        console.error('Authentication error:', data.error?.message);
        // You might want to redirect to login here
        // window.location.href = '/login';
      } else if (status === 403) {
        console.error('Permission denied:', data.error?.message);
      } else if (status === 500) {
        console.error('Server error:', data.error?.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server');
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Dashboard API endpoints
 */
export const dashboardAPI = {
  /**
   * Get dashboard overview metrics
   * @returns {Promise<Object>}
   */
  getOverview: async () => {
    const response = await api.get('/api/dashboard/overview');
    return response.data;
  },

  /**
   * Get posts over time data
   * @param {number} days - Number of days to look back
   * @returns {Promise<Object>}
   */
  getPostsOverTime: async (days = 30) => {
    const response = await api.get('/api/dashboard/posts', {
      params: { days }
    });
    return response.data;
  },

  /**
   * Get daily active users trend
   * @param {number} days - Number of days to look back
   * @returns {Promise<Object>}
   */
  getUserTrend: async (days = 30) => {
    const response = await api.get('/api/dashboard/users/trend', {
      params: { days }
    });
    return response.data;
  },

  /**
   * Get current user information
   * @returns {Promise<Object>}
   */
  getMe: async () => {
    const response = await api.get('/api/dashboard/me');
    return response.data;
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
