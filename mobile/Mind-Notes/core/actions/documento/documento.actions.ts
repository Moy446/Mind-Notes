import { clienteAxios } from "@/core/API/clienteAxios";

export const obtenerDocumento = async (idPsicologo, idPaciente, archivoId) => {
    try {
        const response = await clienteAxios.get(
            `/chat/${idPsicologo}/${idPaciente}/documento/${archivoId}/texto`
        );
        return response.data;
    } catch (error) {
        console.error('Error al descargar documento:', error);
        throw error;
    }
};