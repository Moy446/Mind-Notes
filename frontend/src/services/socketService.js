import { io } from 'socket.io-client';
import { authService } from './authService';

// Obtener el token de autenticación y el tipo de usuario desde el servicio de autenticación
const token = authService.getToken();
const userType = authService.getUserType();

// Configurar la conexión del socket con opciones de transporte y autenticación
const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: true,
    auth: {
        token: token,
        userType: userType
    }
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