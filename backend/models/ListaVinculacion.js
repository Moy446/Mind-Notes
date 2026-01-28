import dbClient from "../config/dbClient.js";
import Usuario from "./Usuario.js";
import { ObjectId } from "mongodb";


class ListaVinculacion {
    constructor(){
        this.colListaVinculacion = dbClient.db?.collection('listaVinculacion');
    }
    async create(idPsicologo, idPaciente){
        try{
            const vinculacion = {  
                idVinculacion: new ObjectId(),
                idPsicologo: ObjectId(idPsicologo),
                idPaciente: ObjectId(idPaciente),
                nombrePsicologo: await new Usuario().findNameById(idPsicologo),
                nombrePaciente: await new Usuario().findNameById(idPaciente),
                fotoPerfilPsicologo: null,
                fotoPerfilPaciente: null,
            };
            const resultado = await this.colListaVinculacion.insertOne(vinculacion);
            return resultado;
        }
        catch (error) {
            console.error("Error al crear la lista de vinculacion:", error);
            throw error;
        }   

    }
    async findVinculacion(idPsicologo, idPaciente){
        try {
            const vinculacion = await this.colListaVinculacion.findOne({idPsicologo: ObjectId(idPsicologo), idPaciente: ObjectId(idPaciente)}); 
            return vinculacion;
        }
        catch (error) {
            throw new Error('Error al buscar la vinculacion: ' + error.message);
        }
    }

   async findByPsicologo(idPsicologo){
        try {
            return this.colListaVinculacion.find({idPsicologo: ObjectId(idPsicologo)}).toArray(); 
        } catch (error) {
            throw new Error('Error al obtener las vinculaciones por psicologo: ' + error.message);
        }
    }

   async findByPaciente(idPaciente){
        try {
            return this.colListaVinculacion.find({idPaciente: ObjectId(idPaciente)}).toArray();   
        } catch (error) {
            throw new Error('Error al obtener las vinculaciones por paciente: ' + error.message);
        }
    }   

    async getAllPacientes(idPsicologo){
        try{
            const vinculaciones = await this.colListaVinculacion.find({idPsicologo: ObjectId(idPsicologo)}).toArray();    
            return vinculaciones;
        }catch(error){
            throw new Error('Error al obtener todos los pacientes vinculados: ' + error.message);
        }   
    }

    getAllPsicologos(idPaciente){
        try{
            return this.colListaVinculacion.find({idPaciente: ObjectId(idPaciente)}).toArray();   
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