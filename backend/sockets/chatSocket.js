import dbClient from '../config/dbClient.js';
import Chat from '../models/Chat.js';
import { ObjectId } from 'mongodb';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('Socket ID:', socket.id);

    // Sala por usuario para notificaciones globales (lista de chats, badges, etc.)
    socket.on('joinUserRoom', ({ userId }) => {
      if (!userId) return;
      const userRoom = `user-${userId}`;
      socket.join(userRoom);
      console.log(`Socket ${socket.id} se unió a ${userRoom}`);
    });

    // Unirse a una sala de chat (ej: 'chat-psicologoId-pacienteId')
    socket.on('joinChat', ({ idPsicologo, idPaciente }) => {
      const room = `chat-${idPsicologo}-${idPaciente}`;
      socket.join(room);
      console.log(`Socket ${socket.id} se unió a ${room}`);
    });

    // Enviar mensaje
    socket.on('sendMessage', async ({ idPsicologo, idPaciente, mensaje, remitente }) => {
      try {

        if (mensaje.length > 500) {
          console.warn('Mensaje demasiado largo, truncando a 500 caracteres');
          mensaje = mensaje.slice(0, 500);
        }
        console.log('📨 Guardando mensaje:', { idPsicologo, idPaciente, mensaje, remitente });
        
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
        
        console.log('✅ Mensaje guardado:', resultado);
        
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
        console.error('❌ Error al enviar mensaje via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado:', socket.id);
    });
  });
};