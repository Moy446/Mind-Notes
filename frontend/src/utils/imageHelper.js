export const getImageUrl = (relativePath, defaultImage = '/src/images/testimg.png') => {
    if (!relativePath) return defaultImage;
    
    // Si ya tiene http, retorna como está
    if (relativePath.startsWith('http')) return relativePath;
    
    // Si es una imagen local, retorna como está
    if (relativePath.startsWith('/')) return relativePath;
    
    // Construye la URL completa
    return `${process.env.REACT_APP_API_URL}/${relativePath}`;
};