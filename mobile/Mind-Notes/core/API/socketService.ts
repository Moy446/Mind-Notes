import { io, Socket } from 'socket.io-client';
import { API_URL } from './clienteAxios';

let socket: Socket | null = null;
const SOCKET_URL = (API_URL || '').replace(/\/api$/, '');

export const initializeSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      // Connected
    });

    socket.on('disconnect', (reason) => {
      // Disconnected
    });

    socket.on('error', (error) => {
      console.error(error);
    });

    socket.on('connect_error', (error) => {
      console.error(error);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const getSocketStatus = (): string => {
  if (!socket) return 'No inicializado';
  if (socket.connected) return 'Conectado';
  if (socket.connected) return 'Conectando...';
  return 'Desconectado';
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;
