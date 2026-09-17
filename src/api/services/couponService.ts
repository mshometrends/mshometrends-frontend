import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Coupon } from '../../types';

export const couponService = {
  getAll: () => {
    return apiClient.get<Coupon[]>(ENDPOINTS.COUPONS.BASE);
  },

  create: (couponData: Partial<Coupon>) => {
    return apiClient.post<Coupon>(ENDPOINTS.COUPONS.BASE, couponData);
  },

  validate: (code: string, cartTotal: number) => {
    return apiClient.post<{ valid: boolean; coupon?: Coupon; discountAmount?: number; message?: string }>(
      ENDPOINTS.COUPONS.VALIDATE,
      { code, cartTotal }
    );
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.COUPONS.BY_ID(id));
  },
};
