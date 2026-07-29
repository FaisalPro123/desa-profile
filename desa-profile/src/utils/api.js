// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Helper Functions
const apiClient = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

// API Endpoints
export const api = {
  // Statistics
  getStatistics: () => apiClient.get('/statistics'),
  
  // Profile
  getProfile: () => apiClient.get('/profile'),
  
  // Members
  getMembers: () => apiClient.get('/members'),
  getMemberById: (id) => apiClient.get(`/members/${id}`),
  
  // News
  getNews: () => apiClient.get('/news'),
  getNewsById: (id) => apiClient.get(`/news/${id}`),
  getNewsByCategory: (category) => apiClient.get(`/news?category=${category}`),
  
  // UMKM
  getUMKM: () => apiClient.get('/umkm'),
  getUMKMById: (id) => apiClient.get(`/umkm/${id}`),
  getUMKMByCategory: (category) => apiClient.get(`/umkm?category=${category}`),
  
  // Map
  getMapData: () => apiClient.get('/map'),
};

export default api;
