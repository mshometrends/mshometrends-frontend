import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { User } from '../../types';

export const userService = {
  getAll: () => {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BASE);
  },

  login: (credentials: { email?: string; phone?: string; password?: string; name?: string }) => {
    return apiClient.post<{ user: User; token?: string }>(ENDPOINTS.USERS.LOGIN, credentials);
  },

  register: (userData: Partial<User> & { password?: string }) => {
    return apiClient.post<{ user: User; token?: string }>(ENDPOINTS.USERS.REGISTER, userData);
  },

  create: (userData: Partial<User> & { password?: string; role?: string; address?: string }) => {
    return apiClient.post<{ success: boolean; message: string; data?: User }>(ENDPOINTS.USERS.BASE, userData);
  },

  update: (id: string, userData: Partial<User> & { password?: string; role?: string; address?: string }) => {
    return apiClient.put<{ success: boolean; message: string; data?: User }>(ENDPOINTS.USERS.BY_ID(id), userData);
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.USERS.BY_ID(id));
  },

  seedAdmin: (credentials?: { email?: string; password?: string; name?: string; phone?: string }) => {
    return apiClient.post<{ success: boolean; message: string; data: any }>(ENDPOINTS.USERS.SEED_ADMIN, credentials);
  },
};
