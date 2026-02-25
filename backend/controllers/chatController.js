import { th } from "framer-motion/client";
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
            console.log('🔍 Buscando mensajes para:', { idPsicologo, idPaciente });
            const chat = new Chat();
            const chatData = await chat.findChatByParticipants(idPaciente, idPsicologo);
            
            if (!chatData) {
                console.log('❌ Chat no encontrado');
                return res.status(404).json({ success: false, message: 'Chat no encontrado', data: [] });
            }
            
            console.log('✅ Chat encontrado con', chatData.mensajes?.length || 0, 'mensajes');
            res.status(200).json({ success: true, data: chatData.mensajes || [] });
        } catch (error) {
            console.error('❌ Error al obtener mensajes:', error);
            res.status(500).json({ success: false, message: 'Error al obtener mensajes: ' + error.message, data: [] });
        }
    }

    async obtenerInformacionChat(req, res){
        try {
            const {idPsicologo, idPaciente} = req.params;
            const chat = new Chat();
            const infoChat = await chat.findChatByParticipants(idPaciente, idPsicologo);
            const patientData = {
                id : infoChat.idPaciente,
                nombre: infoChat.nombrePaciente,
                materialAdjunto: infoChat.materialAdjunto,
                expedientes: infoChat.expedientes,
                grabaciones: infoChat.grabaciones
            } 
            res.status(200).json({success:true, patientData});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error obtener la informacion del paciente: ' + error.message });
        }
    }

}

export default new ChatController();