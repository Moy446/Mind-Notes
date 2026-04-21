import { clienteAxios } from "@/core/API/clienteAxios";

 const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export interface PerfilResponse {
    success:     boolean;
    idUsuario:   string;
    email:       string;
    nombre:      string;
    role:        string;
    suscripcion?: string;
    fotoPerfil:  string;
    token:       string;
}

export const cambiarFotoPerfil = async (formData) => {
    console.log("LLAMANDO API CAMBIAR FOTO");

  try {
    const response = await clienteAxios.put('/usuario/foto', formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'        }
      }
    );
    console.log("DATA COMPLETA:", response.data);
    return response.data;
  } catch (error) {
    console.log("ERROR EN API");
    console.error('Error al cambiar foto:', error);
    throw error;
  }
};

export const actualizarPerfil = async (userId, datos) => {
    try {
        const response = await clienteAxios.put(`/usuario/${userId}`, datos);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
    }
};

export const obtenerHorario = async (userId) => {
    try {
        const response = await clienteAxios.get(`/psicologo/horario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener horario:', error);
        throw error;
    }
};

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