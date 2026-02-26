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
            // Preparar password: null si viene de Google, hasheado si viene de registro normal
            let passwordHash = null;
            if (datosUsuario.password) {
                passwordHash = await bcrypt.hash(datosUsuario.password, 10);
            }

            const usuario = {
                idUsuario: new ObjectId(),
                esPsicologo: esPsicologo,
                password: passwordHash,
                nombre: datosUsuario.nombre || datosUsuario.Nombre,
                email: datosUsuario.email || datosUsuario.Eemail,
                fotoPerfil: datosUsuario.fotoPerfil || datosUsuario.FotoPerfil || null,
                telefono: datosUsuario.telefono || datosUsuario.Telefono || null,
                googleId: datosUsuario.googleId || null,
                fechaCreacion: new Date(),
                verificado: datosUsuario.verificado || false,
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
                usuario.stripeCustomerId = datosUsuario.stripeCustomerId || null;
                usuario.suscripcion = {
                    plan: null,
                    estado: 'inactiva',
                    fechaInicio: null,
                    fechaFin: null,
                    stripeSubscriptionId: null
                };
                
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
            // Validar que el ID sea un ObjectId válido
            if (!ObjectId.isValid(idUsuario)) {
                throw new Error('ID de usuario inválido');
            }
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
    
    async findEmailById(idUsuario){
        try {
            const usuario = await this.colUsuarios.findOne({ idUsuario: new ObjectId(idUsuario) });
            return usuario ? usuario.email : null;
        } catch (error) {
            throw new Error('Error al obtener el email del usuario: ' + error.message);
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
     * Buscar un usuario por Google ID
     */
    async findByGoogleId(googleId){
        try {
            const usuario = await this.colUsuarios.findOne({ googleId: googleId });
            return usuario;
        } catch (error) {
            throw new Error('Error al buscar usuario por Google ID: ' + error.message);
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

    /**
     * Actualizar información del perfil del usuario
     */
    async actualizarPerfil(idUsuario, datosActualizar) {
        try {
            const camposPermitidos = {};
            
            if (datosActualizar.nombre !== undefined) {
                camposPermitidos.nombre = datosActualizar.nombre;
            }
            if (datosActualizar.email !== undefined) {
                camposPermitidos.email = datosActualizar.email;
            }
            if (datosActualizar.telefono !== undefined) {
                camposPermitidos.telefono = datosActualizar.telefono;
            }
            if (datosActualizar.fotoPerfil !== undefined) {
                camposPermitidos.fotoPerfil = datosActualizar.fotoPerfil;
            }
            if (datosActualizar.apellido !== undefined) {
                camposPermitidos.apellido = datosActualizar.apellido;
            }

            if (Object.keys(camposPermitidos).length === 0) {
                throw new Error('No hay campos para actualizar');
            }

            const result = await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { $set: camposPermitidos }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw new Error('Error al actualizar perfil: ' + error.message);
        }
    }

    /**
     * Actualizar Google ID de un usuario
     */
    async actualizarGoogleId(idUsuario, googleId) {
        try {
            const result = await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { $set: { googleId: googleId } }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            throw new Error('Error al actualizar Google ID: ' + error.message);
        }
    }

    async updateStripeCustomerId(idUsuario, stripeCustomerId) {
        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                { $set: { stripeCustomerId: stripeCustomerId } }
            );
        } catch (error) {
            throw new Error('Error al actualizar Stripe Customer ID: ' + error.message);
        }
    }

    async activarPlan(idUsuario, plan, sessionId) {
        const ahora = new Date();
        let fechaFin = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);

        if (plan === 'seisMeses') {
            fechaFin = new Date(ahora.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
        } else if (plan === 'unYear') {
            fechaFin = new Date(ahora.getTime() + 12 * 30 * 24 * 60 * 60 * 1000);
        }

        try {
            await this.colUsuarios.updateOne(
                { idUsuario: new ObjectId(idUsuario) },
                {
                    $set: {
                        'suscripcion.plan': plan,
                        'suscripcion.estado': 'activa',
                        'suscripcion.fechaInicio': ahora,
                        'suscripcion.fechaFin': fechaFin,
                        'suscripcion.stripeSubscriptionId': sessionId
                    }
                }
            );
            return true;
        } catch (error) {
            throw new Error('Error al actualizar suscripcion: ' + error.message);
        }
    }
}

// Exportar la clase Usuario 
export default Usuario;
