import dbClient from "../config/dbClient.js";
import Chat from "../models/Chat.js";
import { ObjectId } from "mongodb";

class ChatController {
    constructor() {
        // No asignar aquí, dbClient.db puede ser null inicialmente
    }

    async createChat(req, res) {
        const { idPaciente, idPsicologo } = req.body;
        try { 
            const chatModel = new Chat();
            const resultado = await chatModel.create({ idPaciente, idPsicologo });
            res.status(201).json({ success: true, chatId: resultado.insertedId });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al crear el chat: ' + error.message });
        }
    }

    async obtenerMensajes(req, res) {
        const { idPsicologo, idPaciente } = req.params;
        try {
            const colMensajes = dbClient.db.collection('mensajes');
            const mensajes = await colMensajes
                .find({ 
                    idPsicologo, 
                    idPaciente 
                })
                .sort({ timestamp: 1 })
                .toArray();
            res.status(200).json({ success: true, data: mensajes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al obtener mensajes: ' + error.message });
        }
    }

    async enviarMensaje(req, res) {
        const { idPsicologo } = req.params;
        const { idPaciente, mensaje, remitente } = req.body;
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