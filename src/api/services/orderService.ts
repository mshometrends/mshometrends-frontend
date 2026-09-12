import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { Order } from '../../types';

export interface AdminOrderQueryParams {
  status?: string;
  paymentStatus?: string;
  source?: string;
  search?: string;
}

export interface AdminOrderResponse {
  success: boolean;
  data: Order[];
  stats?: any;
  message?: string;
}

export interface AdminOrderActionResponse {
  success: boolean;
  data?: Order;
  message?: string;
  order?: Order;
}

export const orderService = {
  getAll: (params?: AdminOrderQueryParams) => {
    let url = ENDPOINTS.ORDERS.BASE;
    if (params) {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.paymentStatus && params.paymentStatus !== 'all') query.append('paymentStatus', params.paymentStatus);
      if (params.source && params.source !== 'all') query.append('source', params.source);
      if (params.search) query.append('search', params.search);
      const qs = query.toString();
      if (qs) url += `?${qs}`;
    }
    return apiClient.get<Order[]>(url);
  },

  getAdminOrders: (params?: AdminOrderQueryParams | Record<string, string>) => {
    let url = ENDPOINTS.ADMIN_ORDERS.BASE;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== 'all') query.append(k, v);
      });
      const qs = query.toString();
      if (qs) url += `?${qs}`;
    }
    return apiClient.get<AdminOrderResponse>(url);
  },

  getById: (id: string) => {
    return apiClient.get<Order>(ENDPOINTS.ORDERS.BY_ID(id));
  },

  track: (trackingQuery: string) => {
    return apiClient.get<Order[]>(ENDPOINTS.ORDERS.TRACK(trackingQuery));
  },

  trackOrder: (trackingQuery: string) => {
    return apiClient.get<Order[]>(ENDPOINTS.ORDERS.TRACK(trackingQuery));
  },

  create: (orderData: Partial<Order>) => {
    return apiClient.post<{ success: boolean; data: Order; message?: string }>(ENDPOINTS.ORDERS.BASE, orderData);
  },

  updateStatus: (orderId: string, statusOrPayload: string | { orderStatus?: string; status?: string; adminNote?: string }, notes?: string) => {
    const payload = typeof statusOrPayload === 'string' ? { orderStatus: statusOrPayload, notes } : statusOrPayload;
    return apiClient.patch<AdminOrderActionResponse>(ENDPOINTS.ADMIN_ORDERS.STATUS(orderId), payload);
  },

  confirmPayment: (orderId: string, payloadOrTx?: string | { verifiedBy?: string; adminNote?: string; transactionId?: string }) => {
    const payload = typeof payloadOrTx === 'string' ? { transactionId: payloadOrTx } : (payloadOrTx || {});
    return apiClient.patch<AdminOrderActionResponse>(ENDPOINTS.ADMIN_ORDERS.CONFIRM_PAYMENT(orderId), payload);
  },

  rejectPayment: (orderId: string, payloadOrReason?: string | { rejectionReason?: string; adminNote?: string }) => {
    const payload = typeof payloadOrReason === 'string' ? { rejectionReason: payloadOrReason } : (payloadOrReason || {});
    return apiClient.patch<AdminOrderActionResponse>(ENDPOINTS.ADMIN_ORDERS.REJECT_PAYMENT(orderId), payload);
  },

  uploadPaymentScreenshot: (orderId: string, screenshotUrl: string, transactionId?: string) => {
    return apiClient.post<{ success: boolean; order: Order; message: string }>(
      ENDPOINTS.ORDERS.PAYMENT_SCREENSHOT(orderId),
      { screenshotUrl, transactionId }
    );
  },

  getInvoice: (orderId: string) => {
    return apiClient.get<{ success: boolean; invoiceNumber: string; order: Order }>(
      ENDPOINTS.ORDERS.INVOICE(orderId)
    );
  },
};
