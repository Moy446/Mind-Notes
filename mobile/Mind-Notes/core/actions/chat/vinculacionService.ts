import { clienteAxios } from '@/core/API/clienteAxios';

export interface PacienteVinculado {
  idPaciente: string;
  nombrePaciente: string;
  nombre?: string;
  fotoPerfilPaciente?: string;
  email?: string;
}

export interface PsicologoVinculado {
  idPsicologo: string;
  nombrePsicologo: string;
  nombre?: string;
  fotoPerfilPsicologo?: string;
  email?: string;
}

export const obtenerPacientesVinculados = async (
  idPsicologo: string
): Promise<PacienteVinculado[]> => {
  try {
    const { data } = await clienteAxios.get(`/pacientes/${idPsicologo}`);
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('Error al obtener pacientes vinculados:', error);
    return [];
  }
};

export const obtenerPsicologosVinculados = async (
  idPaciente: string
): Promise<PsicologoVinculado[]> => {
  try {
    const { data } = await clienteAxios.get(`/psicologos/${idPaciente}`);
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('Error al obtener psicologos vinculados:', error);
    return [];
  }
};

export const vincularPaciente = async (
  idPsicologo: string,
  idPaciente: string
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await clienteAxios.post(`/vincularPacientes/${idPsicologo}`, {
    idPaciente,
  });
  return data;
};

export const vincularPsicologo = async (
  idPaciente: string,
  idPsicologo: string
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await clienteAxios.post(`/vincularPsicologo/${idPaciente}`, {
    idPsicologo,
  });
  return data;
};
