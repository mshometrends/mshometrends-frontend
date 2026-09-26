/**
 * MS Home Trends - API Configuration
 * Automatically detects whether we are in local dev, proxy mode, or separate backend deployment.
 */

// Reads API Base URL from Vite environment variable (VITE_API_BASE_URL)
// e.g. 'https://mshometrends-backend.vercel.app' or 'https://mshometrends-backend.vercel.app/api/v1'
const ENV_API_URL = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.VITE_API_BASE_URL : undefined;

// Normalize base URL: strip trailing slashes
const rawBaseUrl = ENV_API_URL ? String(ENV_API_URL).trim().replace(/\/+$/, '') : '';

export const API_CONFIG = {
  BASE_URL: rawBaseUrl || '/api/v1',
  V1_PREFIX: '/v1',
  TIMEOUT: 25000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Returns clean backend origin (without trailing /api/v1 or /api)
 * e.g. 'https://mshometrends-backend.vercel.app/api/v1' -> 'https://mshometrends-backend.vercel.app'
 */
export const getApiOrigin = (): string => {
  // If running in browser on mshometrends.vercel.app or any .vercel.app deployment,
  // ALWAYS return '' so requests use same-origin /api/v1 (proxied seamlessly by vercel.json rewrite with zero CORS).
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
  }

  const base = API_CONFIG.BASE_URL;
  if (!base || (!base.startsWith('http://') && !base.startsWith('https://'))) {
    return '';
  }
  return base.replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
};

/**
 * Returns full URL for standard /api/v1 endpoints, correctly handling:
 * - Full external URLs (kept as-is)
 * - Custom backend base URLs with or without /api/v1 prefix
 * - Double /api/v1/api/v1 duplicate paths (automatically de-duplicated)
 * - Clean relative paths for same-origin dev/container
 */
export const getApiV1Url = (endpoint: string): string => {
  if (!endpoint) {
    const origin = getApiOrigin();
    return origin ? `${origin}/api/v1` : '/api/v1';
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('http://') || cleanEndpoint.startsWith('https://')) {
    // If the external URL has duplicate /api/v1/api/v1, fix it
    return cleanEndpoint.replace(/\/api\/v1\/api\/v1\//g, '/api/v1/');
  }

  // Exact base matches
  if (
    cleanEndpoint === '/api/v1' ||
    cleanEndpoint === '/api/v1/' ||
    cleanEndpoint === '/api' ||
    cleanEndpoint === '/api/'
  ) {
    const origin = getApiOrigin();
    return origin ? `${origin}/api/v1` : '/api/v1';
  }

  // Strip all leading /api/v1, /api, or /v1 occurrences to obtain pure relative resource path
  let resourcePath = cleanEndpoint;
  while (resourcePath.startsWith('/api/v1/')) {
    resourcePath = resourcePath.slice('/api/v1/'.length);
  }
  while (resourcePath.startsWith('/api/')) {
    resourcePath = resourcePath.slice('/api/'.length);
  }
  while (resourcePath.startsWith('/v1/')) {
    resourcePath = resourcePath.slice('/v1/'.length);
  }
  if (resourcePath.startsWith('/')) {
    resourcePath = resourcePath.slice(1);
  }

  const origin = getApiOrigin();
  return origin ? `${origin}/api/v1/${resourcePath}` : `/api/v1/${resourcePath}`;
};

/**
 * Returns full URL for standard API endpoints, normalized to /api/v1
 */
export const getApiUrl = (endpoint: string): string => {
  return getApiV1Url(endpoint);
};
