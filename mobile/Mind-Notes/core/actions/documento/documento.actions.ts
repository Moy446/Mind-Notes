import { clienteAxios } from "@/core/API/clienteAxios";

export const obtenerDocumento = async (idPsicologo: string, idPaciente: string, archivoId: string) => {
    try {
        const response = await clienteAxios.get(`/chat/${idPsicologo}/${idPaciente}/documentos/${archivoId}/texto`);
        console.log("Respuesta del servidor al obtener documento:", response);
        return response.data;
    } catch (error) {
        console.error('Error al descargar documento:', error);
        throw error;
    }
};

export const guardarDocumento = async (idPsicologo: string, idPaciente: string, archivoId: string, content: string) => {
  try {
    const response = await clienteAxios.put(
      `/chat/${idPsicologo}/${idPaciente}/documento/${archivoId}`,
      { content }
    );

    return response.data;
  } catch (error) {
    console.error("Error al guardar:", error);
    throw error;
  }
};