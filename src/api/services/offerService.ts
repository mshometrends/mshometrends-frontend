import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Offer } from '../../types';

export const offerService = {
  getAll: () => {
    return apiClient.get<Offer[]>(ENDPOINTS.OFFERS.BASE);
  },

  create: (offerData: Partial<Offer>) => {
    return apiClient.post<Offer>(ENDPOINTS.OFFERS.BASE, offerData);
  },

  update: (id: string, offerData: Partial<Offer>) => {
    return apiClient.put<Offer>(ENDPOINTS.OFFERS.BY_ID(id), offerData);
  },

  toggle: (id: string) => {
    return apiClient.put<{ success: boolean; offer: Offer }>(ENDPOINTS.OFFERS.TOGGLE(id));
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.OFFERS.BY_ID(id));
  },
};
