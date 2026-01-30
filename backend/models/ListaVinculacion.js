import dbClient from "../config/dbClient.js";
import Usuario from "./Usuario.js";
import Chat from "./Chat.js";
import { ObjectId } from "mongodb";


class ListaVinculacion {
    constructor(){
        this.colListaVinculacion = dbClient.db?.collection('listaVinculacion');
    }
    async create(idPsicologo, idPaciente){
        try{
            const usuario = new Usuario();
            const dataPsicologo = await usuario.findById(idPsicologo)
            const dataPaciente = await usuario.findById(idPaciente)
            const chat = new Chat();
            const vinculacion = {  
                idVinculacion: new ObjectId(),
                idPsicologo: new ObjectId(idPsicologo),
                idPaciente: new ObjectId(idPaciente),
                nombrePsicologo: dataPsicologo.nombre,
                nombrePaciente: dataPaciente.nombre,
                fotoPerfilPsicologo: dataPsicologo.fotoPerfil || "/src/images/userDefault.png",
                fotoPerfilPaciente: dataPaciente.fotoPerfil || "/src/images/userDefault.png",
            };
            const datosChat ={
                idPaciente: idPaciente,
                idPsicologo: idPsicologo,
                nombrePaciente: dataPaciente.nombre,
                nombrePsicologo: dataPsicologo.nombre,
            }
            const resVinculacion = await this.colListaVinculacion.insertOne(vinculacion);
            const resChat = await chat.create(datosChat);
            if(!resVinculacion || !resChat){
                throw new Error('Error al crear la vinculacion o el chat');
            }
            return resVinculacion;
        }
        catch (error) {
            console.error("Error al crear la lista de vinculacion:", error);
            throw error;
        }   

    }
    async findVinculacion(idPsicologo, idPaciente){
        try {
            const vinculacion = await this.colListaVinculacion.findOne({idPsicologo: new ObjectId(idPsicologo), idPaciente: new ObjectId(idPaciente)}); 
            return vinculacion;
        }
        catch (error) {
            throw new Error('Error al buscar la vinculacion: ' + error.message);
        }
    }

   async findByPsicologo(idPsicologo){
        try {
            return this.colListaVinculacion.find({idPsicologo: new ObjectId(idPsicologo)}).toArray(); 
        } catch (error) {
            throw new Error('Error al obtener las vinculaciones por psicologo: ' + error.message);
        }
    }

   async findByPaciente(idPaciente){
        try {
            return this.colListaVinculacion.find({idPaciente: new ObjectId(idPaciente)}).toArray();   
        } catch (error) {
            throw new Error('Error al obtener las vinculaciones por paciente: ' + error.message);
        }
    }   

    async getAllPacientes(idPsicologo){
        try{
            const vinculaciones = await this.colListaVinculacion.find({idPsicologo: new ObjectId(idPsicologo)}).toArray();    
            return vinculaciones;
        }catch(error){
            throw new Error('Error al obtener todos los pacientes vinculados: ' + error.message);
        }   
    }

    getAllPsicologos(idPaciente){
        try{
            return this.colListaVinculacion.find({idPaciente: new ObjectId(idPaciente)}).toArray();   
        }catch(error){
            throw new Error('Error al obtener todos los psicologos vinculados: ' + error.message);
        }
    }   


   async getAll(){
        try {
            const vinculaciones = await this.colListaVinculacion.find().toArray();
            return vinculaciones;
        } catch (error) {
            throw new Error('Error al obtener todas las vinculaciones: ' + error.message);
        }   
    }

}   
export default ListaVinculacion;