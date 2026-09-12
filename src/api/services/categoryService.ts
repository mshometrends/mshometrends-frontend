import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Category } from '../../types';

export const categoryService = {
  getAll: () => {
    return apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.BASE);
  },

  getById: (id: string) => {
    return apiClient.get<Category>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  create: (categoryData: Partial<Category>) => {
    return apiClient.post<Category>(ENDPOINTS.CATEGORIES.BASE, categoryData);
  },

  update: (id: string, categoryData: Partial<Category>) => {
    return apiClient.put<Category>(ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};
