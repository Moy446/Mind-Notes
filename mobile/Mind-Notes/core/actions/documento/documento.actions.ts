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

export const guardarDocumento = async (idPsicologo, idPaciente, archivoId, content) => {
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