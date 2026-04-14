/**
 * Configuración centralizada de URLs
 * Todas las URLs se resuelven aquí desde variables de entorno
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
const BASE_URL = BACKEND_URL.replace(/\/api\/?$/, '');

export const API_CONFIG = {
  BACKEND_URL,
  BASE_URL,
  SOCKET_URL: BASE_URL,
  API_BASE: BACKEND_URL,
};

/**
 * Construir URL de imagen desde el backend
 * @param {string} relativePath - Ruta relativa de la imagen
 * @param {string} [defaultImage='/src/images/testimg.png'] - Imagen por defecto si no hay ruta
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (relativePath, defaultImage = '/src/images/testimg.png') => {
  if (!relativePath) return defaultImage;
  
  const cleanPath = String(relativePath).replace(/^undefined\/?/, '');
  
  // Si ya tiene http o es una ruta local, dejar como está
  if (cleanPath.startsWith('http') || cleanPath.startsWith('/src/')) {
    return cleanPath;
  }
  
  // Si es una ruta relativa (ej: uploads/images/...), construir URL completa automáticamente
  return `${API_CONFIG.BASE_URL}/${cleanPath}`;
};

export default API_CONFIG;
