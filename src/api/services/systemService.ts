import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

export const systemService = {
  getDbStatus: () => {
    return apiClient.get<{
      connected: boolean;
      status: string;
      counts: {
        products: number;
        categories: number;
        orders: number;
        reviews: number;
        coupons: number;
      };
      database: string;
      cloudinary: {
        configured: boolean;
        cloudName?: string;
      };
    }>(ENDPOINTS.SYSTEM.DB_STATUS);
  },

  seedDatabase: () => {
    return apiClient.post<{ success: boolean; message: string }>(ENDPOINTS.SYSTEM.SEED);
  },

  checkHealth: () => {
    return apiClient.get<{ status: string; uptime: number; timestamp: string }>(ENDPOINTS.SYSTEM.HEALTH);
  },
};
