import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Banner } from '../../types';

export const bannerService = {
  getAll: () => {
    return apiClient.get<Banner[]>(ENDPOINTS.BANNERS.BASE);
  },

  create: (bannerData: Partial<Banner>) => {
    return apiClient.post<Banner>(ENDPOINTS.BANNERS.BASE, bannerData);
  },

  update: (id: string, bannerData: Partial<Banner>) => {
    return apiClient.put<Banner>(ENDPOINTS.BANNERS.BY_ID(id), bannerData);
  },

  toggle: (id: string) => {
    return apiClient.put<{ success: boolean; banner: Banner }>(ENDPOINTS.BANNERS.TOGGLE(id));
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.BANNERS.BY_ID(id));
  },
};
