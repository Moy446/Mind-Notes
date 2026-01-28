import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import bcrypt from 'bcryptjs';

/*
Modelo unificado de datos para Usuarios (Psicólogos y Pacientes)
Aqui unicamente se definen las operaciones relacionadas con la coleccion de Usuarios
en la base de datos MongoDB
Operaciones como crear, buscar por ID, buscar por email, etc.
Ignorar validaciones y logica de negocio, estas se manejan en los controladores
*/

class Usuario {
    constructor(){
        this.colUsuarios = dbClient.db.collection('usuarios');
    }

    async create(datosUsuario, esPsicologo = false){
        try {
            const usuario = {
                idUsuario: new ObjectId(),
                esPsicologo: esPsicologo,
                password: await bcrypt.hash(datosUsuario.password || datosUsuario.Password, 10),
                nombre: datosUsuario.nombre || datosUsuario.Nombre,
                email: datosUsuario.email || datosUsuario.Eemail,
                fotoPerfil: datosUsuario.fotoPerfil || datosUsuario.FotoPerfil || null,
                telefono: datosUsuario.telefono || datosUsuario.Telefono || null,
                fechaCreacion: new Date(),
            };

            // Campos específicos de Psicólogo
            if (esPsicologo) {
                usuario.apellido = datosUsuario.apellido || datosUsuario.Apellido;
                usuario.fechaInicio = datosUsuario.fechaInicio || datosUsuario.FechaInicio;
                usuario.fechaFin = datosUsuario.fechaFin || datosUsuario.FechaFin;
                usuario.socketId = datosUsuario.socketId || datosUsuario.SocketId || null;
                usuario.statusChat = datosUsuario.statusChat || datosUsuario.StatusChat || 'offline';
            } 
            // Campos específicos de Paciente

            await this.colUsuarios.insertOne(usuario);
            return usuario;
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }
    
    /**
     * Buscar un usuario por su ID
     */
    async findById(idUsuario){
        try {
            const usuario = await this.colUsuarios.findOne({ idUsuario: new ObjectId(idUsuario) });
            return usuario;
        } catch (error) {
            throw new Error('Error al buscar el usuario por ID: ' + error.message);
        }
    }
  
    /**
     * Obtener el nombre del usuario por su ID
     */
    async findNameById(idUsuario){
        try {
            const usuario = await this.colUsuarios.findOne({ idUsuario: new ObjectId(idUsuario) });
            return usuario ? usuario.nombre : null;
        } catch (error) {
            throw new Error('Error al obtener el nombre del usuario: ' + error.message);
        }   
    }

    /**
     * Buscar un usuario por email
     */
    async findByEmail(email){
        try {
            const usuario = await this.colUsuarios.findOne({ email: email });
            return usuario;
        } catch (error) {
            throw new Error('Error al buscar el usuario por email: ' + error.message);
        }
    }

    /**
     * Buscar todos los psicólogos
     */
    async findAllPsicologos(){
        try {
            const psicologos = await this.colUsuarios.find({ esPsicologo: true }).toArray();
            return psicologos;
        } catch (error) {
            throw new Error('Error al buscar psicólogos: ' + error.message);
        }
    }

    /**
     * Buscar todos los pacientes
     */
    async findAllPacientes(){
        try {
            const pacientes = await this.colUsuarios.find({ esPsicologo: false }).toArray();
            return pacientes;
        } catch (error) {
            throw new Error('Error al buscar pacientes: ' + error.message);
        }
    }

    /**
     * Actualizar socketId de un usuario (principalmente para psicólogos)
     */
    async updateSocketId(idUsuario, socketId){
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { $set: { socketId: socketId } }
            );
        } catch (error) {
            throw new Error('Error al actualizar socketId: ' + error.message);
        }
    }

    /**
     * Actualizar status de chat de un usuario (principalmente para psicólogos)
     */
    async updateStatusChat(idUsuario, status){
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { $set: { statusChat: status } }
            );
        } catch (error) {
            throw new Error('Error al actualizar status de chat: ' + error.message);
        }
    }
}

// Exportar la clase Usuario 
export default Usuario;
