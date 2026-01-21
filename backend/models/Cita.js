import dbClient from "../config/dbClient.js";
import { ObjectId } from "mongodb";

/* Modelo de datos para Cita
   Aqui unicamente se definen las operaciones relacionadas con la coleccion de Citas
   en la base de datos MongoDB
   Operaciones como crear, buscar por ID de psicologo, buscar por ID de paciente, etc.
   Ignorar validaciones y logica de negocio, estas se manejan en los controladores
*/

class Cita {
    constructor(){
        this.colCitas = dbClient.db.collection('citas');
    }
    async create(datosCita){
        try{
            const cita = {
                idPaciente : datosCita.idPaciente,
                idPsicologo: datosCita.idPsicologo,
                nombrePaciente: datosCita.nombrePaciente,
                nombrePsicologo: datosCita.nombrePsicologo,
                fechaCita: datosCita.fechaCita,
                horaInicio: datosCita.horaInicio,
                horaFin: datosCita.horaFin,
                duracion: datosCita.duracion,
                estado: datosCita.estado || 'programada',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const resultado = await this.colCitas.insertOne(cita);
            return resultado;
        } catch (error) {
            console.error("Error al crear la cita:", error);
            throw error;
        }
    }
    async findCitaByIdPsicologo(idPsicologo){
        try {
            const citas = await this.colCitas.find({idPsicologo: idPsicologo}).toArray();
            return citas;
        } catch (error) {
            throw new Error('Error al obtener las citas: ' + error.message);
        }
    }
    async findCitaByIdPaciente(idPaciente){
        try {
            const citas = await this.colCitas.find({idPaciente: idPaciente}).toArray();
            return citas;
        } catch (error) {
            throw new Error('Error al obtener las citas: ' + error.message);
        }
    }
    async getCitaById(idCita){
        try {
            if (!ObjectId.isValid(idCita)) {
                throw new Error('ID de cita no válido');
            }
            const cita = await this.colCitas.findOne({_id: new ObjectId(idCita)});
            return cita;
        } catch (error) {
            throw new Error('Error al obtener la cita: ' + error.message);
        }
    }
    async editCita(idCita, datosCitaActualizados){
        try{
            if (!ObjectId.isValid(idCita)) {
                throw new Error('ID de cita no válido');
            }
            const resultado = await this.colCitas.updateOne({_id: new ObjectId(idCita)}, { $set: {...datosCitaActualizados, updatedAt: new Date()}
            });
            if (resultado.matchedCount === 0) {
                throw new Error("No se encontró la cita");
            }
            return resultado;
        }catch(error){
            throw new Error('Error al editar la cita: ' + error.message);
        }
    }
}

export default Cita;