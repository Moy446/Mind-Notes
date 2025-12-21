import { ObjectId } from "mongodb";
import dbClient from "../config/dbclient.js";

class Psicologo {
    constructor(){
        this.colPsicologos = dbClient.db.collection('psicologos');
    }
    //Funcion para crear un nuevo psicologo en la base de datos
    async create(datosPsicologo){
        try {
            const psicologo = {
                idPsicologo: new ObjectId(datosPsicologo.idPsicologo),
                password: datosPsicologo.password,
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
    //Funcion para buscar un psicologo por su ID
    async findById(idPsicologo){
        try {
            const psicologo = await this.colPsicologos.findOne({ idPsicologo: new ObjectId(idPsicologo) });
            return psicologo;
        } catch (error) {
            throw new Error('Error al buscar el psicologo por ID: ' + error.message);
        }
    }
    //Funcion para obtener todos los psicologos
    async findAll(){
        try {
            const psicologos = await this.colPsicologos.find({}).toArray();
            return psicologos;
        } catch (error) {
            throw new Error('Error al obtener los psicologos: ' + error.message);
        }
    }
}
// Exportar la clase Psicologo 
export default Psicologo;