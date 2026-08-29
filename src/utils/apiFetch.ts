const metaEnv = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env;
const configuredApiBaseUrl = metaEnv?.VITE_API_BASE_URL?.trim();

/**
 * Resolves API paths against the backend origin configured for the frontend.
 *
 * VITE_API_BASE_URL may include a path (for example /api/v1/), so API paths
 * beginning with `/` deliberately keep their own path while inheriting the
 * configured protocol, host, and port.
 */
export const apiUrl = (input: string): string => {
  if (!configuredApiBaseUrl || !input.startsWith('/')) return input;

  return new URL(input, configuredApiBaseUrl).toString();
};

export const apiFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  if (typeof input === 'string') return fetch(apiUrl(input), init);

  return fetch(input, init);
};
