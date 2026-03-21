import clienteAxios from './axios';

export const subirArchivo = async (idPsicologo, idPaciente, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await clienteAxios.post(
            `/chat/${idPsicologo}/${idPaciente}/archivo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al subir archivo:', error);
        throw error;
    }
};

export const obtenerMensajes = async (idPsicologo, idPaciente) => {
    try {
        const response = await clienteAxios.get(`/chat/${idPsicologo}/${idPaciente}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        throw error;
    }
};

export const obtenerInformacionChat = async (idPsicologo, idPaciente) => {
    try {
        const response = await clienteAxios.get(`/chat/info/${idPsicologo}/${idPaciente}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener información del chat:', error);
        throw error;
    }
};

export const descargarArchivo = async (idPsicologo, idPaciente, archivoId) => {
    try {
        const response = await clienteAxios.get(
            `/chat/${idPsicologo}/${idPaciente}/archivo/${archivoId}`,
            {
                responseType: 'blob',
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        throw error;
    }
};

export const obtenerDocumento = async (idPsicologo, idPaciente, archivoId) => {
    try {
        const response = await clienteAxios.get(
            `/chat/${idPsicologo}/${idPaciente}/documento/${archivoId}`,
            {
                responseType: 'blob',
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al descargar documento:', error);
        throw error;
    }
};

export const eliminarArchivo = async (idPsicologo, idPaciente, archivoId) => {
    try {
        const response = await clienteAxios.delete(
            `/chat/${idPsicologo}/${idPaciente}/archivo/${archivoId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        throw error;
    }
};
