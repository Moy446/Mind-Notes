export const getImageUrl = (relativePath, defaultImage = '/src/images/testimg.png') => {
    if (!relativePath) return defaultImage;
    const cleanPath = String(relativePath).replace(/^undefined\/?/, '');
    const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
    
    // Si ya tiene http, retorna como está
    if (cleanPath.startsWith('http')) return cleanPath;
    
    // Imágenes estáticas del frontend
    if (cleanPath.startsWith('/src/')) return cleanPath;

    // Path absoluto servido por backend
    if (cleanPath.startsWith('/')) return `${apiBaseUrl}${cleanPath}`;
    
    // Construye la URL completa
    return `${apiBaseUrl}/${cleanPath}`;
};