import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor
api.interceptors.request.use(request => {
  console.log('Starting Request', request.method, request.url);
  return request;
});

// Add response interceptor
api.interceptors.response.use(response => {
  console.log('Response:', response.status, response.data);
  return response;
}, error => {
  console.log('Response Error:', error.response?.status, error.response?.data);
  return Promise.reject(error);
});

export const inviteService = {
  sendInvite: async (userId: number, friendId: number) => {
    const response = await api.post('/invites', { userId, friendId });
    return response.data;
  },
  getInvites: async (userId: number) => {
    const response = await api.get(`/invites/${userId}`);
    return response.data;
  },
  acceptInvite: async (inviteId: number, userId: number) => {
    const response = await api.post(`/invites/${inviteId}/accept`, { userId });
    return response.data;
  },
  rejectInvite: async (inviteId: number, userId: number) => {
    const response = await api.post(`/invites/${inviteId}/reject`, { userId });
    return response.data;
  },
};

export const friendService = {
  getFriends: async (userId: number) => {
    const response = await api.get(`/friends/${userId}`);
    return response.data;
  },
};

export const lockService = {
  getLockStatus: async () => {
    const response = await api.get('/lock-status');
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export default api;
