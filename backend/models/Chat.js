import dbClient from "../config/dbClient.js";

class Chat {
    constructor(){
        this.colChat = dbClient.db.collection('chat');
    }
    async create(datosChat){
        try{
            const chat = {
                idPaciente : datosChat.idPaciente,
                idPsicologo: datosChat.idPsicologo,
                nombrePaciente: datosChat.nombrePaciente,
                nombrePsicologo: datosChat.nombrePsicologo,
                contenido : datosChat.contenido || null,
                materialAdjunto: datosChat.materialAdjunto || null,
                expedientes: datosChat.expedientes || null,
            };
            const resultado = await this.colChat.insertOne(chat);
            return resultado;
        } catch (error) {
            console.error("Error al crear el chat:", error);
            throw error;
        }
    }
    async findChatByParticipants(idPaciente, idPsicologo){
        try {
            const chats = await this.colChat.find({
                idPaciente: idPaciente,
                idPsicologo: idPsicologo
            }).toArray();
            return chats;
        } catch (error) {
            throw new Error('Error al obtener los chats: ' + error.message);
        }   
    }
}

export default Chat;