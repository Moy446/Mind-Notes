import dbClient from "../config/dbClient.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';

/* Modelo de datos para Paciente
   Aqui unicamente se definen las operaciones relacionadas con la coleccion de Pacientes
   en la base de datos MongoDB
   Operaciones como crear, buscar por ID, buscar por email, etc.
   Ignorar validaciones y logica de negocio, estas se manejan en los controladores
*/

class Paciente {
    constructor(){
        this.colPacientes = dbClient.db.collection('pacientes');
    }
    async create(datosUsuario){
        try{
            const paciente = {
                idPaciente: new ObjectId(datosUsuario.idPaciente),
                nombre: datosUsuario.nombre,
                email: datosUsuario.email,
                password: await bcrypt.hash(datosUsuario.password, 10),
                telefono: datosUsuario.telefono,
                fotoPerfil: datosUsuario.fotoPerfil || null,
                fechaCreacion: new Date(),
                socketId: datosUsuario.socketId || null,
                statusChat: datosUsuario.statusChat || 'offline'
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

    async findByEmail(email){
        try {
            const paciente = await this.colPacientes.findOne({ email: email });
            return paciente ? paciente.idPaciente : null;
        } catch (error) {
            throw new Error('Error al buscar el paciente por email: ' + error.message);
        }
    }
}

export default Paciente;