import dbClient from "../config/dbClient.js";
import { ObjectId } from "mongodb";

class Agenda {
    constructor() {
        this.colAgenda = dbClient.db.collection('agenda');
    }
    async create(datosAgenda) {
        try {
            const agenda = {
                idCita: new ObjectId(datosAgenda.idCita),
                idPsicologo: new ObjectId(datosAgenda.idPsicologo),
                idPaciente: new ObjectId(datosAgenda.idPaciente),
                horaInicio: datosAgenda.horaInicio,
                horaFin: datosAgenda.horaFin,
                fechaCita: new Date(datosAgenda.fechaCita + "T00:00:00"),
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
        } catch (error) {
            console.error("Error al crear la agenda:", error);
            throw error;
        }
    }
    async getAgenda(idPsicologo) {
        try {
            const agenda = await this.colAgenda.find({ idPsicologo: new ObjectId(idPsicologo) }).toArray();
            return agenda;
        } catch (error) {
            console.error("Error al obtener la agenda:", error);
            throw error;
        }
    }

    async update(idCita, datosActualizados) {
        try {
            datosActualizados.idCita = new ObjectId(datosActualizados.idCita);
            datosActualizados.idPaciente = new ObjectId(datosActualizados.idPaciente);
            datosActualizados.idPsicologo = new ObjectId(datosActualizados.idPsicologo);
            datosActualizados.fechaCita = new Date(datosActualizados.fechaCita + "T00:00:00");
            const agendaActualizada = await this.colAgenda.updateOne({ idCita: new ObjectId(idCita) }, { $set: { ...datosActualizados, updatedAt: new Date() } });
            return agendaActualizada;
        } catch (error) {
            console.error("Error al actualizar la agenda:", error);
            throw error;
        }
    }

    async updateStatus(idCita, status) {
        try {
            const agendaActualizada = await this.colAgenda.updateOne({ idCita: new ObjectId(idCita) }, { $set: { status: status, updatedAt: new Date() } });
            return agendaActualizada;
        } catch (error) {
            console.error("Error al actualizar el estado de la agenda:", error);
            throw error;
        }
    }
    async searchByDayAndPsychologist(fechaCita, idPsicologo) {
        try {
            const inicio = new Date(fechaCita+ "T00:00:00");

            const fin = new Date(fechaCita+ "T23:59:59");

            console.log(inicio, fin)
            const datesOfDay = await this.colAgenda.find({
                idPsicologo: new ObjectId(idPsicologo),
                fechaCita: {
                    $gte: inicio,
                    $lte: fin
                }
            }).toArray();
            return datesOfDay;
        } catch (error) {
            console.error("Error al buscar el dia en la agenda:", error);
            throw error;
        }
    }
}

export default Agenda;