import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import bcrypt from 'bcryptjs';
/*
Modelo de datos para Psicologo
Aqui unicamente se definen las operaciones relacionadas con la coleccion de Psicologos
en la base de datos MongoDB
Operaciones como crear, buscar por ID, buscar por email, etc.
Ignorar validaciones y logica de negocio, estas se manejan en los controladores
*/
class Psicologo {
    constructor(){
        this.colPsicologos = dbClient.db.collection('psicologos');
    }
    //Funcion para crear un nuevo psicologo en la base de datos
    async create(datosPsicologo){
        try {
            const psicologo = {
                idPsicologo: new ObjectId(datosPsicologo.idPsicologo),
                password: await bcrypt.hash(datosPsicologo.Password, 10),
                nombre: datosPsicologo.nombre,
                apellido: datosPsicologo.apellido,
                fechaInicio: datosPsicologo.fechaInicio,
                fechaFin: datosPsicologo.fechaFin,
                cedula: datosPsicologo.cedula,
                email: datosPsicologo.email,
                fotoPerfil: datosPsicologo.fotoPerfil,               
                fechaCreacion: new Date(),

               
            };
            const resultado = await this.colPsicologos.insertOne(psicologo);
            return {
                success: true,
                message: 'Psicologo creado exitosamente',
                data: resultado
            };

        } catch (error) {
            throw new Error('Error al crear el psicologo: ' + error.message);
        }
    }
    
    //Funcion para buscar un psicologo por su ID
    async findById(idPsicologo){
        try {
            const psicologo = await this.colPsicologos.findOne({ idPsicologo: new ObjectId(idPsicologo) });
            return psicologo;
        } catch (error) {
            throw new Error('Error al buscar el psicologo por ID: ' + error.message);
        }
    }
  
    //Funcion para obtener el nombre del psicologo por su ID
    async findNameById(idPsicologo){
        try {
            var psicologo = await this.colPsicologos.findOne({ idPsicologo: new ObjectId(idPsicologo) });
            return psicologo ? psicologo.nombre : null;
        } catch (error) {
            throw new Error('Error al obtener el nombre del psicologo: ' + error.message);
        }   
    }

    async findByEmail(email){
        try {
            const psicologo = await this.colPsicologos.findOne({ email: email });
            return psicologo;
        } catch (error) {
            throw new Error('Error al buscar el psicologo por email: ' + error.message);
        }
    }
}
// Exportar la clase Psicologo 
export default Psicologo;