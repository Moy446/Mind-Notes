import { API_URL } from './clienteAxios';

const FALLBACK_BASE_URL = 'http://localhost:5000';

export const getBackendBaseUrl = (): string => {
  const rawUrl = API_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

  if (!rawUrl) return FALLBACK_BASE_URL;

  try {
    const parsed = new URL(rawUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '') || FALLBACK_BASE_URL;
  }
};

export const resolveMediaUrl = (pathOrUrl?: string, placeholderUrl = 'https://via.placeholder.com/48'): string => {
  if (!pathOrUrl) return placeholderUrl;

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith('/src/images/')) {
    return placeholderUrl;
  }

  const base = getBackendBaseUrl();
  const normalizedPath = pathOrUrl.replace(/^\/+/, '');
  return `${base}/${normalizedPath}`;
};
