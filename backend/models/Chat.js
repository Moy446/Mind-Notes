import dbClient from "../config/dbClient.js";

/* Modelo de datos para Chat
   Aqui unicamente se definen las operaciones relacionadas con la coleccion de Chat
   en la base de datos MongoDB
   Operaciones como crear, buscar por ID de psicologo y paciente, etc.
   Ignorar validaciones y logica de negocio, estas se manejan en los controladores
*/

class Chat {
    constructor(){
        this.colChat = dbClient.db.collection('chat');
    }
    async create(datosChat){
       try {
            let chat = {
                idPaciente: datosChat.idPaciente,
                idPsicologo: datosChat.idPsicologo,
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