import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const inviteService = {
  sendInvite: async (userId: number, friendId: number) => {
    const response = await api.post('/invitations', { userId, friendId });
    return response.data;
  },
  getInvites: async (userId: number) => {
    const response = await api.get(`/invitations?userId=${userId}`);
    return response.data;
  },
  acceptInvite: async (inviteId: number, userId: number) => {
    const response = await api.post(`/invitations/${inviteId}/accept`, { userId });
    return response.data;
  },
  rejectInvite: async (inviteId: number, userId: number) => {
    const response = await api.post(`/invitations/${inviteId}/reject`, { userId });
    return response.data;
  },
  getFriends: async (userId: number) => {
    const response = await api.get(`/friends?userId=${userId}`);
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export const unlockService = {
  sendUnlockRequest: async (userId: number, friendId: number) => {
    const response = await api.post('/unlocks', { userId, friendId });
    return response.data;
  },
  getUnlockRequests: async (userId: number) => {
    const response = await api.get(`/unlocks/requests?userId=${userId}`);
    return response.data;
  },
  acceptUnlockRequest: async (unlockRequestId: number) => {
    const response = await api.post(`/unlocks/${unlockRequestId}/accept`);
    return response.data;
  },
  rejectUnlockRequest: async (unlockRequestId: number) => {
    const response = await api.post(`/unlocks/${unlockRequestId}/reject`);
    return response.data;
  },
};

export default api;
