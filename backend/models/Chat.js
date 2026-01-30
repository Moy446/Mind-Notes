import dbClient from "../config/dbClient.js";
import { ObjectId } from "mongodb";

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
            const chat = {
                idPaciente: new ObjectId(datosChat.idPaciente),
                idPsicologo: new ObjectId(datosChat.idPsicologo),
                nombrePaciente: datosChat.nombrePaciente,
                nombrePsicologo: datosChat.nombrePsicologo,
                mensajes: [],
                materialAdjunto: [],                
                expedientes: [],
                grabaciones: []
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
            const chats = await this.colChat.findOne({
                idPaciente: new ObjectId(idPaciente),
                idPsicologo: new ObjectId(idPsicologo)
            })
            return chats;
        } catch (error) {
            throw new Error('Error al obtener los chats: ' + error.message);
        }   
    }

    async insertMaterialAdjunto(idPsicologo,idPaciente, materialPath){
        try {
            const resultado = await this.colChat.updateOne({
                idPaciente: new ObjectId(idPaciente),
                idPsicologo: new ObjectId(idPsicologo)
            },{
                $push: { materialAdjunto: {
                    _id: new ObjectId(),
                    type:  materialPath.split('.').pop(),
                    nombre: materialPath.split('/').pop(),
                    path: materialPath,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }}
            });
            return resultado;
        } catch (error) {
            throw new Error('Error al insertar los materiales adjuntos: ' + error.message);
        }   
    }
    async insertExpediente(idPsicologo,idPaciente, expedientePath){
        try {
            const resultado = await this.colChat.updateOne({
                idPaciente: new ObjectId(idPaciente),
                idPsicologo: new ObjectId(idPsicologo)
            },{
                $push: { expedientes: {
                    _id: new ObjectId(),
                    type:  expedientePath.split('.').pop(),
                    nombre: expedientePath.split('/').pop(),
                    path: expedientePath,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }}
            });
            return resultado;
        } catch (error) {
            throw new Error('Error al insertar los expedientes: ' + error.message);
        }   
    }
    async insertGrabacion(idPsicologo,idPaciente, grabacionPath){
        try {
            const resultado = await this.colChat.updateOne({
                idPaciente: new ObjectId(idPaciente),
                idPsicologo: new ObjectId(idPsicologo)
            },{
                $push: { grabaciones: {
                    _id: new ObjectId(),
                    type:  grabacionPath.split('.').pop(),
                    nombre: grabacionPath.split('/').pop(),
                    path: grabacionPath,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }}
            });
            return resultado;
        } catch (error) {
            throw new Error('Error al insertar los grabaciones: ' + error.message);
        }   
    }

}

export default Chat;