import dbClient from '../config/dbClient.js';

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
        const colMensajes = dbClient.db.collection('mensajes');
        const nuevoMensaje = {
          idPsicologo,
          idPaciente,
          mensaje,
          remitente,
          timestamp: new Date()
        };
        await colMensajes.insertOne(nuevoMensaje);
        const room = `chat-${idPsicologo}-${idPaciente}`;
        io.to(room).emit('receiveMessage', nuevoMensaje);
      } catch (error) {
        console.error('Error al enviar mensaje via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado:', socket.id);
    });
  });
};