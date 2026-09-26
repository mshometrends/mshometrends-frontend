import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Product } from '../../types';

export const productService = {
  getAll: (params?: { category?: string; search?: string }) => {
    let url = ENDPOINTS.PRODUCTS.BASE;
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;
    return apiClient.get<Product[]>(url);
  },

  getById: (id: string) => {
    return apiClient.get<Product>(ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  create: (productData: Partial<Product>) => {
    return apiClient.post<Product>(ENDPOINTS.PRODUCTS.BASE, productData);
  },

  update: (id: string, productData: Partial<Product>) => {
    return apiClient.put<Product>(ENDPOINTS.PRODUCTS.BY_ID(id), productData);
  },

  delete: (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  toggleFeatured: (id: string) => {
    return apiClient.put<Product>(ENDPOINTS.PRODUCTS.FEATURE(id));
  },
};
