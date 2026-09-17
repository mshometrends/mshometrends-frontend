/**
 * MS Home Trends - Admin API Service
 * Routes all admin actions directly through the /api/v1/admin pipeline.
 */

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Order } from '../../types';

export interface AdminStats {
  totalOrders: number;
  pendingPayments: number;
  screenshotsReceived: number;
  paymentsUnderReview: number;
  paidOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  count: number;
  stats?: AdminStats;
  data: Order[];
  message?: string;
}

export const adminService = {
  /**
   * GET /api/v1/admin
   * Fetch overview stats & system status
   */
  getOverview: () => {
    return apiClient.get<{
      success: boolean;
      message: string;
      endpoint: string;
      data: {
        totalOrders: number;
        pendingOrders: number;
        totalProducts: number;
        totalUsers: number;
        totalRevenue: number;
      };
    }>(ENDPOINTS.ADMIN.BASE);
  },

  /**
   * GET /api/v1/admin/stats
   * Fetch detailed order fulfillment & payment stats
   */
  getStats: () => {
    return apiClient.get<AdminOrdersResponse>(ENDPOINTS.ADMIN.STATS);
  },

  /**
   * GET /api/v1/admin/orders
   * Fetch orders with filter queries (status, paymentStatus, search)
   */
  getOrders: (params?: Record<string, string>) => {
    let url = ENDPOINTS.ADMIN.ORDERS;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return apiClient.get<AdminOrdersResponse>(url);
  },

  /**
   * GET /api/v1/admin/orders/:orderId
   */
  getOrderById: (orderId: string) => {
    return apiClient.get<{ success: boolean; data: Order; message?: string }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}`
    );
  },

  /**
   * PATCH /api/v1/admin/orders/:orderId/confirm-payment
   */
  confirmPayment: (orderId: string, data?: { verifiedBy?: string; adminNote?: string }) => {
    return apiClient.patch<{ success: boolean; message: string; data: Order }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}/confirm-payment`,
      data
    );
  },

  /**
   * PATCH /api/v1/admin/orders/:orderId/reject-payment
   */
  rejectPayment: (orderId: string, data?: { rejectionReason?: string; adminNote?: string }) => {
    return apiClient.patch<{ success: boolean; message: string; data: Order }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}/reject-payment`,
      data
    );
  },

  /**
   * PATCH /api/v1/admin/orders/:orderId/status
   */
  updateOrderStatus: (orderId: string, data: { orderStatus?: string; status?: string; adminNote?: string }) => {
    return apiClient.patch<{ success: boolean; message: string; data: Order }>(
      `${ENDPOINTS.ADMIN.ORDERS}/${encodeURIComponent(orderId)}/status`,
      data
    );
  },

  /**
   * GET /api/v1/admin/users
   */
  getUsers: () => {
    return apiClient.get(ENDPOINTS.ADMIN.USERS);
  },

  /**
   * DELETE /api/v1/admin/users/:id
   */
  deleteUser: (userId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `${ENDPOINTS.ADMIN.USERS}/${encodeURIComponent(userId)}`
    );
  },

  /**
   * POST /api/v1/admin/seed-admin
   */
  seedAdmin: (credentials?: { email?: string; password?: string; name?: string; phone?: string }) => {
    return apiClient.post<{ success: boolean; message: string; data: any }>(
      ENDPOINTS.ADMIN.SEED_ADMIN,
      credentials
    );
  },

  /**
   * POST /api/v1/admin/login
   */
  login: (credentials: { email: string; password: string }) => {
    return apiClient.post<{ success: boolean; message: string; user?: any; token?: string }>(
      ENDPOINTS.ADMIN.LOGIN,
      credentials
    );
  },
};
