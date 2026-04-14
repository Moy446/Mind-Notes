import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/apiConfig';

// La conexión del socket no requiere token en auth porque las cookies HttpOnly
// se envían automáticamente con autoConnect y rejectUnauthorized: false
const socket = io(API_CONFIG.SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
    withCredentials: true, // IMPORTANTE: para enviar las cookies HttpOnly
});

// Manejar eventos de conexión
socket.on('connect', () => {
    console.log('Conectado al servidor de chat');
});
// Manejar eventos de desconexión
socket.on('disconnect', () => {
    console.log('Desconectado del servidor de chat');
});
// Manejar errores de conexión
socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error);
});

export default socket;