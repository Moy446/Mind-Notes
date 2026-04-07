import { io, Socket } from 'socket.io-client';
import { API_URL } from './clienteAxios';

let socket: Socket | null = null;

const getSocketBaseUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';

  try {
    const parsed = new URL(rawUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    // Fallback for malformed env values.
    return rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }
};

const SOCKET_URL = getSocketBaseUrl(API_URL);

export const initializeSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: '/socket.io',
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
