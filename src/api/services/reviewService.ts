import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Review } from '../../types';

export const reviewService = {
  getAll: (productId?: string) => {
    let url = ENDPOINTS.REVIEWS.BASE;
    if (productId) {
      url += `?productId=${encodeURIComponent(productId)}`;
    }
    return apiClient.get<Review[]>(url);
  },

  create: (reviewData: Partial<Review>) => {
    return apiClient.post<Review>(ENDPOINTS.REVIEWS.BASE, reviewData);
  },

  approve: (reviewId: string) => {
    return apiClient.put<Review>(ENDPOINTS.REVIEWS.APPROVE(reviewId));
  },

  delete: (reviewId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.REVIEWS.BY_ID(reviewId));
  },
};
