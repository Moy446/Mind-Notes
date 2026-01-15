import dbClient from "../config/dbClient.js";

class ChatController {
    constructor() {
        // No asignar aquí, dbClient.db puede ser null inicialmente
    }

    async obtenerMensajes(req, res) {
        const { idPsicologo } = req.params;
        const { idPaciente } = req.query; // Asumiendo query param para filtrar
        try {
            const colMensajes = dbClient.db.collection('mensajes');
            const filter = { idPsicologo };
            if (idPaciente) filter.idPaciente = idPaciente;
            const mensajes = await colMensajes.find(filter).sort({ timestamp: 1 }).toArray();
            res.status(200).json({ success: true, mensajes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al obtener mensajes: ' + error.message });
        }
    }

    async enviarMensaje(req, res) {
        const { idPsicologo } = req.params;
        const { idPaciente, mensaje, remitente } = req.body; // remitente: 'paciente' o 'psicologo'
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
            res.status(201).json({ success: true, message: 'Mensaje enviado' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al enviar mensaje: ' + error.message });
        }
    }
}

export default new ChatController();