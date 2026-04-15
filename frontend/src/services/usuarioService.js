import clienteAxios from './axios';
/*
* Servicio para manejar las operaciones relacionadas con el usuario, 
* como actualizar perfil, cambiar foto, obtener información, etc.
* Cada función hace una llamada a la API correspondiente y maneja errores de forma centralizada.
*/

// Actualizar información del usuario
export const actualizarPerfil = async (userId, datos) => {
    try {
        const response = await clienteAxios.put(`/usuario/${userId}`, datos);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
    }
};

//Actualizar foto de perfil
export const cambiarFotoPerfil = async (formData) => {
    try {
        const response = await clienteAxios.put('/usuario/foto', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error al cambiar foto:', error);
        throw error;
    }
};

// Obtener información del usuario
export const obtenerPerfil = async (userId) => {
    try {
        const response = await clienteAxios.get(`/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        throw error;
    }
};

// Funcion obtener horario de un psicologo
export const obtenerHorario = async (userId) => {
    try {
        const response = await clienteAxios.get(`/psicologo/horario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener horario:', error);
        throw error;
    }
};

// Función para actualizar el horario del psicólogo
export const actualizarHorario = async (userId, horario) => {
    try {
        const response = await clienteAxios.post(`/psicologo/horario`, { horario });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar horario:', error);
        throw error;
    }
};

export const eliminarCuenta = async (payload) => {
    try {
        const requestBody = typeof payload === 'object' && payload !== null
            ? payload
            : { userId: payload };

        const response = await clienteAxios.post('/deleteAccount', requestBody);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        throw error;
    }
};
