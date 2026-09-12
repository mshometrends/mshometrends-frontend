/**
 * MS Home Trends - Centralized HTTP API Client
 * Wraps native fetch with typed responses, custom headers, base URL handling, and error formatting.
 */

import { API_CONFIG, getApiV1Url } from './config';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  public buildUrl(path: string): string {
    return getApiV1Url(path);
  }

  private async request<T = any>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.buildUrl(path);
    const headers: Record<string, string> = {
      ...API_CONFIG.HEADERS,
      ...(options.headers as Record<string, string> || {}),
    };

    // Automatically attach admin/user authorization token if present in storage
    if (typeof window !== 'undefined' && !headers['Authorization'] && !headers['authorization']) {
      try {
        const adminToken =
          sessionStorage.getItem('ms_admin_token') ||
          localStorage.getItem('ms_admin_token') ||
          sessionStorage.getItem('ms_admin_key');

        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`;
          headers['x-admin-key'] = adminToken;
        } else {
          // Check regular user token
          const userToken = localStorage.getItem('ms_user_token') || sessionStorage.getItem('ms_user_token');
          if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
          }
        }
      } catch (e) {
        // Ignore storage access error
      }
    }

    // If body is FormData, delete Content-Type so browser sets boundary multipart automatically
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      let responseData: any;

      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const errorMessage =
          (typeof responseData === 'object' && responseData?.message) ||
          (typeof responseData === 'string' && responseData) ||
          `HTTP Error ${response.status}: ${response.statusText}`;

        throw new ApiError(errorMessage, response.status, responseData);
      }

      return responseData as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err?.message || 'Network request failed', 0, err);
    }
  }

  public get<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public post<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    });
  }

  public put<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    });
  }

  public patch<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    });
  }

  public delete<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new HttpClient();

/**
 * Standard fetch helper that guarantees the request starts with /api/v1
 * Example: apiFetch('/admin') -> hits /api/v1/admin
 */
export const apiFetch = (path: string, options: RequestInit = {}): Promise<Response> => {
  const url = apiClient.buildUrl(path);
  return fetch(url, options);
};
