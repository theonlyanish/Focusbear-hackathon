import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const inviteService = {
  sendInvite: async (userId: number, friendEmail: string) => {
    const response = await api.post('/invites', { userId, friendEmail });
    return response.data;
  },
  getInvites: async (userId: number) => {
    const response = await api.get(`/invites?userId=${userId}`);
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

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export default api;
