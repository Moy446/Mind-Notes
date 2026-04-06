import { clienteAxios } from '@/core/API/clienteAxios';

export interface Message {
  _id?: string;
  idPsicologo: string;
  idPaciente: string;
  mensaje: string;
  remitente: 'psicologo' | 'paciente';
  timestamp?: string;
}

export interface ChatInfo {
  patientData: {
    nombre?: string;
    fotoPerfilPaciente?: string;
    materialAdjunto?: any[];
    expedientes?: any[];
    grabaciones?: any[];
  };
}

export const obtenerMensajes = async (
  idPsicologo: string,
  idPaciente: string
): Promise<Message[]> => {
  try {
    const { data } = await clienteAxios.get(
      `/chat/${idPsicologo}/${idPaciente}`
    );
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return [];
  }
};

export const obtenerInformacionChat = async (
  idPsicologo: string,
  idPaciente: string
): Promise<ChatInfo> => {
  try {
    const { data } = await clienteAxios.get(
      `/chat/info/${idPsicologo}/${idPaciente}`
    );
    return data || {};
  } catch (error) {
    console.error('Error al obtener información del chat:', error);
    return { patientData: {} };
  }
};

export const enviarMensaje = (
  socket: any,
  idPsicologo: string,
  idPaciente: string,
  mensaje: string
) => {
  if (socket && mensaje.trim()) {
    socket.emit('sendMessage', {
      idPsicologo,
      idPaciente,
      mensaje,
      remitente: 'psicologo',
    });
  }
};
