import dbClient from '../config/dbClient.js';
import Chat from '../models/Chat.js';
import { ObjectId } from 'mongodb';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('Socket ID:', socket.id);

    // Unirse a una sala de chat (ej: 'chat-psicologoId-pacienteId')
    socket.on('joinChat', ({ idPsicologo, idPaciente }) => {
      const room = `chat-${idPsicologo}-${idPaciente}`;
      socket.join(room);
      console.log(`Socket ${socket.id} se unió a ${room}`);
    });

    // Enviar mensaje
    socket.on('sendMessage', async ({ idPsicologo, idPaciente, mensaje, remitente }) => {
      try {
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
      } catch (error) {
        console.error('❌ Error al enviar mensaje via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado:', socket.id);
    });
  });
};