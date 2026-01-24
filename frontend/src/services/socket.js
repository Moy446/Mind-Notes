import { io } from 'socket.io-client';
import { authService } from './authService';

const token = authService.getToken();
const userType = authService.getUserType();

const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: true,
    auth: {
        token: token,
        userType: userType
    }
});

socket.on('connect', () => {
    console.log('✅ Conectado al servidor de chat');
});

socket.on('disconnect', () => {
    console.log('❌ Desconectado del servidor de chat');
});

socket.on('connect_error', (error) => {
    console.error('❌ Error de conexión:', error);
});

export default socket;