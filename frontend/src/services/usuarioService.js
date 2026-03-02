import axios from './axios';

/**
 * Actualizar información del usuario
 */
export const actualizarPerfil = async (userId, datos) => {
    try {
        const response = await axios.put(`/usuario/${userId}`, datos);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
    }
};

/**
 * Actualizar foto de perfil
 */
export const actualizarFotoPerfil = async (userId, formData) => {
    try {
        const response = await axios.put(`/usuario/${userId}/foto`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar foto de perfil:', error);
        throw error;
    }
};

/**
 * Obtener información del usuario
 */
export const obtenerPerfil = async (userId) => {
    try {
        const response = await axios.get(`/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        throw error;
    }
};

// Funcion obtener horario de un psicologo
export const obtenerHorario = async (userId) => {
    try {
        const response = await axios.get(`/psicologo/horario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener horario:', error);
        throw error;
    }
};

// Función para actualizar el horario del psicólogo
export const actualizarHorario = async (userId, horario) => {
    try {
        const response = await axios.post(`/psicologo/horario`, { horario });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar horario:', error);
        throw error;
    }
};
