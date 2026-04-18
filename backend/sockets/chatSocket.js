import Chat from '../models/Chat.js';
import { ObjectId } from 'mongodb';

export default (io) => {
  io.on('connection', (socket) => {
    // Sala por usuario para notificaciones globales (lista de chats, badges, etc.)
    socket.on('joinUserRoom', ({ userId }) => {
      if (!userId) return;
      const userRoom = `user-${userId}`;
      socket.join(userRoom);
    });

    // Unirse a una sala de chat (ej: 'chat-psicologoId-pacienteId')
    socket.on('joinChat', ({ idPsicologo, idPaciente }) => {
      try {
        if (!idPsicologo || !idPaciente) return;
        const room = `chat-${idPsicologo}-${idPaciente}`;
        socket.join(room);
      }
      catch (error) {
        console.error('Error al unirse a la sala de chat:', error);
      }
    });

    // Enviar mensaje
    socket.on('sendMessage', async ({ idPsicologo, idPaciente, mensaje, remitente }) => {
      try {

        if (mensaje.length > 500) {
          mensaje = mensaje.slice(0, 500);
        }
        
        const chat = new Chat();
        const nuevoMensaje = {
          _id: new ObjectId(),
          mensaje,
          remitente,
          timestamp: new Date()
        };

    
        
        // Insertar el mensaje dentro del array mensajes del Chat
        const resultado = await chat.insertMensaje(
          idPsicologo,
          idPaciente,
          nuevoMensaje
        );

        if (!resultado) return;
        
        const room = `chat-${idPsicologo}-${idPaciente}`;
        io.to(room).emit('receiveMessage', nuevoMensaje);

        // Refrescar lista de chats en tiempo real para ambos participantes
        io.to(`user-${idPsicologo}`).emit('updateChatList', {
          idPsicologo,
          idPaciente,
          mensaje,
          timestamp: nuevoMensaje.timestamp
        });
        io.to(`user-${idPaciente}`).emit('updateChatList', {
          idPsicologo,
          idPaciente,
          mensaje,
          timestamp: nuevoMensaje.timestamp
        });
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
    });

    socket.on('disconnect', () => {});
  });
};