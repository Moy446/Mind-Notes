import { clienteAxios } from '@/core/API/clienteAxios';

export interface PacienteVinculado {
  idPaciente: string;
  nombrePaciente: string;
  nombre?: string;
  fotoPerfilPaciente?: string;
  email?: string;
}

export const obtenerPacientesVinculados = async (
  idPsicologo: string
): Promise<PacienteVinculado[]> => {
  try {
    const { data } = await clienteAxios.get(
      `/psicologoApp/pacientes/${idPsicologo}`
    );
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('Error al obtener pacientes vinculados:', error);
    return [];
  }
};
