import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import bcrypt from 'bcryptjs';
import { u } from "framer-motion/client";

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
                verificado: false,
                tokenVerificacion: null,
                tokenRecuperacion: null,
                tokenExpiracion: null,
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

    /**
     * Actualizar token de verificación
     */
    async actualizarTokenVerificacion(idUsuario, tokenHash) {
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { $set: { tokenVerificacion: tokenHash } }
            );
        } catch (error) {
            throw new Error('Error al actualizar token de verificación: ' + error.message);
        }
    }

    /**
     * Actualizar token de recuperación y expiración
     */
    async actualizarTokenRecuperacion(idUsuario, tokenHash, expiracion) {
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { 
                    $set: { 
                        tokenRecuperacion: tokenHash,
                        tokenExpiracion: expiracion
                    } 
                }
            );
            console.log('Token de recuperación actualizado para usuario:', idUsuario);
        } catch (error) {
            throw new Error('Error al actualizar token de recuperación: ' + error.message);
        }
    }

    /**
     * Buscar usuario por token de recuperación
     */
    async findByRecuperacionToken(tokenHash) {
        try {
            const usuario = await this.colUsuarios.findOne({ tokenRecuperacion: tokenHash });
            return usuario;
        } catch (error) {
            throw new Error('Error al buscar por token de recuperación: ' + error.message);
        }
    }

    /**
     * Buscar usuario por token de verificación
     */
    async findByVerificacionToken(tokenHash) {
        try {
            const usuario = await this.colUsuarios.findOne({ tokenVerificacion: tokenHash });
            return usuario;
        } catch (error) {
            throw new Error('Error al buscar por token de verificación: ' + error.message);
        }
    }

    /**
     * Marcar usuario como verificado
     */
    async marcarVerificado(idUsuario) {
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { 
                    $set: { 
                        verificado: true,
                        tokenVerificacion: null
                    } 
                }
            );
        } catch (error) {
            throw new Error('Error al marcar como verificado: ' + error.message);
        }
    }

    /**
     * Actualizar contraseña
     */
    async actualizarPassword(idUsuario, newPasswordHash) {
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { $set: { password: newPasswordHash } }
            );
        } catch (error) {
            throw new Error('Error al actualizar contraseña: ' + error.message);
        }
    }

    /**
     * Invalidar token de recuperación
     */
    async invalidarTokenRecuperacion(idUsuario) {
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { 
                    $set: { 
                        tokenRecuperacion: null,
                        tokenExpiracion: null
                    } 
                }
            );
        } catch (error) {
            throw new Error('Error al invalidar token de recuperación: ' + error.message);
        }
    }
}

// Exportar la clase Usuario 
export default Usuario;
