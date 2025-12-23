import dbClient from "../config/dbclient.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';

class Paciente {
    constructor(){
        this.colPacientes = dbClient.db.collection('pacientes');
    }
    async create(datosUsuario){
        try{
            const paciente = {
                idPaciente: new ObjectId(datosUsuario.idPaciente),
                nombre: datosUsuario.nombre,
                email: await bcrypt.hash(datosUsuario.email, 10),
                password: await bcrypt.hash(datosUsuario.password, 10),
                telefono: datosUsuario.telefono,
                fotoPerfil: datosUsuario.fotoPerfil || null,
                fechaCreacion: new Date(),
            };
            const resultado = await this.colPacientes.insertOne(paciente);
            return resultado;
        } catch (error) {
            console.error("Error al crear paciente:", error);
            throw error;
        }
    }
    async findById(idPaciente){
            try {
                const paciente = await this.colPacientes.findOne({ idPaciente: new ObjectId(idPaciente) });
                return paciente;
            } catch (error) {
                throw new Error('Error al buscar el paciente por ID: ' + error.message);
            }
    }

    async findNameById(idPaciente){
        try {
            var paciente = await this.colPacientes.findOne({ idPaciente: new ObjectId(idPaciente) });
            return paciente ? paciente.nombre : null;
        } catch (error) {
            throw new Error('Error al obtener el nombre del paciente: ' + error.message);
        }
    }
    
}

export default Paciente;