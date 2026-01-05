import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import bcrypt from 'bcryptjs';

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
    async login(email, password){
        try {
            const psicologo =  await this.colPsicologos.findOne({ email: email});
            if(psicologo && await bcrypt.compare(password, psicologo.password)){
                return { success: true, psicologo: psicologo };
            } else {
                return { success: false, message: 'Email o contraseña incorrectos' };
            }
        } catch (error) {
            console.error("Error en login de psicologo:", error);
            throw error;
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
}
// Exportar la clase Psicologo 
export default Psicologo;