import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { ShippingRule } from '../../types';

export const shippingService = {
  getAll: () => {
    return apiClient.get<ShippingRule[]>(ENDPOINTS.SHIPPING.BASE);
  },

  create: (ruleData: Partial<ShippingRule>) => {
    return apiClient.post<ShippingRule>(ENDPOINTS.SHIPPING.BASE, ruleData);
  },

  calculate: (cartTotal: number, city?: string) => {
    return apiClient.post<{ shippingFee: number; appliedRule?: ShippingRule; freeShippingEligible?: boolean }>(
      ENDPOINTS.SHIPPING.CALCULATE,
      { cartTotal, city }
    );
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.SHIPPING.BY_ID(id));
  },
};
