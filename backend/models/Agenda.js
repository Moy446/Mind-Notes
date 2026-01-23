import dbClient from "../config/dbClient.js";

class Agenda {
    constructor(){
        this.colAgenda = dbClient.db.collection('agenda');
    }
    async create(datosAgenda){
        try{
            const agenda = {
                idCita: datosAgenda.idCita,
                idPsicologo: datosAgenda.idPsicologo,
                idPaciente: datosAgenda.idPaciente,
                horaInicio: datosAgenda.horaInicio,
                horaFin: datosAgenda.horaFin,
                fechaCita: datosAgenda.fechaCita,
                fotoPaciente: datosAgenda.fotoPaciente || null,
                fotoPsicologo: datosAgenda.fotoPsicologo || null,
                nombrePaciente: datosAgenda.nombrePaciente || '',
                nombrePsicologo: datosAgenda.nombrePsicologo || '',
                status: datosAgenda.status || 'programada',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const resultado = await this.colAgenda.insertOne(agenda);
            return resultado;
        }catch(error){
            console.error("Error al crear la agenda:", error);
            throw error;
        }
    }
    async getAgenda(idPsicologo){
        try {
            const agenda = await this.colAgenda.find({idPsicologo: idPsicologo}).toArray();
            return agenda;
        } catch (error) {
            console.error("Error al obtener la agenda:", error);
            throw error;
        }
    }
}

export default Agenda;