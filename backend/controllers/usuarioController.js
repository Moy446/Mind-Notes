import Usuario from "../models/Usuario.js";
import ListaVinculacion from "../models/ListaVinculacion.js";
import Chat from "../models/Chat.js";
import Cita from "../models/Cita.js";
import Agenda from "../models/Agenda.js";
import Bcrypt from 'bcryptjs';
import cookieCtrl from "../helpers/cookiesControll.js";
import emailService from "../helpers/emailService.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';
import { li } from "framer-motion/client";
import path from 'path';
import fs from 'fs';


class UsuarioController {

    constructor() {

    }

    /**
     * Registrar un nuevo usuario (Psicólogo o Paciente)
     * @param {Boolean} esPsicologo - true para psicólogo, false para paciente
     */
    async registrarUsuario(req, res, esPsicologo = false) {
        try {
            const { nombre, email, password } = req.body;

            const usuarioModel = new Usuario();
            const emailExistente = await usuarioModel.findByEmail(email);

            if (emailExistente) {
                return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
            }
            else {
                // Validación de contraseña coincidente para ambos tipos de usuarios
                const passwordConfirm = req.body.passwordConfirm;
                if (!passwordConfirm) {
                    return res.status(400).json({ success: false, message: 'Debes confirmar la contraseña' });
                }
                if (password !== passwordConfirm) {
                    return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden' });
                }

                const allData = {
                    password,
                    nombre,
                    email,
                    fotoPerfil: req.body.fotoPerfil || null
                };

                // Campos adicionales según el tipo de usuario
                if (esPsicologo) {
                    allData.apellido = req.body.apellido || null;
                    allData.fechaInicio = req.body.fechaInicio || new Date();
                    allData.fechaFin = req.body.fechaFin || null;
                    allData.cedula = req.body.cedula || null;
                } else {
                    allData.telefono = req.body.telefono || '';
                }

                const user = await usuarioModel.create(allData, esPsicologo);

                // Generar token de verificación
                const tokenVerificacion = crypto.randomBytes(32).toString('hex');
                const tokenHash = crypto.createHash('sha256').update(tokenVerificacion).digest('hex');

                await usuarioModel.actualizarTokenVerificacion(user.idUsuario, tokenHash);

                // Enviar correo de verificación
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const resultadoEmail = await emailService.enviarVerificacion(
                    user.email,
                    user.nombre,
                    tokenVerificacion,
                    frontendUrl
                );

                // Generar tokens según el tipo de usuario
                const role = esPsicologo ? 'psicologo' : 'paciente';

                if (esPsicologo) {
                    const accessToken = cookieCtrl.signAccess({ id: user.idUsuario, role });
                    const refreshToken = cookieCtrl.signRefresh({ id: user.idUsuario, role });
                    cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
                    res.status(201).json({
                        success: true,
                        idPsicologo: user.idUsuario,
                        idUsuario: user.idUsuario,
                        nombre: user.nombre,
                        mensaje: 'Registro exitoso. Verifica tu correo para activar tu cuenta'
                    });
                } else {
                    const accessToken = cookieCtrl.signAccess({ id: user.idUsuario, role });
                    const refreshToken = cookieCtrl.signRefresh({ id: user.idUsuario, role });
                    cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
                    // Limpia cookie legacy por compatibilidad hacia atrás
                    res.clearCookie('token');
                    res.status(201).json({
                        success: true,
                        idPaciente: user.idUsuario,
                        idUsuario: user.idUsuario,
                        mensaje: 'Registro exitoso. Verifica tu correo para activar tu cuenta'
                    });
                }
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al registrar: ' + error.message });
        }
    }

    /**
     * Registrar un psicólogo
     */
    registrarPsicologoBD = async (req, res) => {
        return this.registrarUsuario(req, res, true);

    }

    /**
     * Registrar un paciente
     */
    registrarPacienteBD = async (req, res) => {
        return this.registrarUsuario(req, res, false);
    }

    /**
     * Iniciar sesión (Psicólogo o Paciente)
     * @param {Boolean} esPsicologo - true para psicólogo, false para paciente
     */
    async loginUsuario(req, res, esPsicologo = false) {
        try {
            const { email, password } = req.body;
            const usuarioModel = new Usuario();
            const usuario = await usuarioModel.findByEmail(email);

            if (!usuario) {
                const tipoUsuario = esPsicologo ? 'Psicologo' : 'Paciente';
                return res.status(404).json({ success: false, message: `${tipoUsuario} no encontrado` });
            }

            // Verificar que la cuenta esté verificada
            if (!usuario.verificado) {
                return res.status(403).json({
                    success: false,
                    message: 'Debes verificar tu correo antes de acceder'
                });
            }

            // Verificar que el tipo de usuario coincida
            if (usuario.esPsicologo !== esPsicologo) {
                const tipoEsperado = esPsicologo ? 'psicólogo' : 'paciente';
                const tipoReal = usuario.esPsicologo ? 'psicólogo' : 'paciente';
                return res.status(403).json({
                    success: false,
                    message: `Esta cuenta es de tipo ${tipoReal}, no ${tipoEsperado}`
                });
            }

            // Verificar que el usuario tenga contraseña (no fue registrado solo con Google)
            if (!usuario.password) {
                return res.status(403).json({
                    success: false,
                    message: 'Esta cuenta fue registrada con Google. Por favor usa "Iniciar con Google"',
                    loginMethod: 'google'
                });
            }

            // Verificar que el usuario tenga contraseña (no fue registrado solo con Google)
            if (!usuario.password) {
                return res.status(403).json({
                    success: false,
                    message: 'Esta cuenta fue registrada con Google. Por favor usa "Iniciar con Google"',
                    loginMethod: 'google'
                });
            }

            const isPasswordValid = await Bcrypt.compare(password, usuario.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }

            const role = esPsicologo ? 'psicologo' : 'paciente';

            const respond = async () => {
                if (esPsicologo) {
                    const accessToken = cookieCtrl.signAccess({ id: usuario.idUsuario, role });
                    const refreshToken = cookieCtrl.signRefresh({ id: usuario.idUsuario, role });
                    cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
                    console.log(usuario);
                    return res.status(200).json({
                        success: true,
                        idPsicologo: usuario.idUsuario,
                        idUsuario: usuario.idUsuario,
                        nombre: usuario.nombre,
                        suscripcion: usuario.suscripcion?.plan || 'Plan Gratuito',
                    });
                }

                const accessToken = cookieCtrl.signAccess({ id: usuario.idUsuario, role: 'paciente' });
                const refreshToken = cookieCtrl.signRefresh({ id: usuario.idUsuario, role: 'paciente' });
                cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
                res.clearCookie('token');
                return res.status(200).json({
                    success: true,
                    idPaciente: usuario.idUsuario,
                    idUsuario: usuario.idUsuario,
                    nombre: usuario.nombre,
                });
            };

            return respond();
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }
    }

    /**
     * Login unificado - detecta automáticamente el tipo de usuario
     */
    loginUnificado = async (req, res) => {
        try {
            const { email, password } = req.body;
            const usuarioModel = new Usuario();
            const usuario = await usuarioModel.findByEmail(email);

            if (!usuario) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            // Verificar que la cuenta esté verificada
            if (!usuario.verificado) {
                return res.status(403).json({
                    success: false,
                    message: 'Debes verificar tu correo antes de acceder'
                });
            }

            // Verificar que el usuario tenga contraseña (no fue registrado solo con Google)
            if (!usuario.password) {
                return res.status(403).json({
                    success: false,
                    message: 'Esta cuenta fue registrada con Google. Por favor usa "Iniciar con Google"',
                    loginMethod: 'google'
                });
            }

            const isPasswordValid = await Bcrypt.compare(password, usuario.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }

            // Detectar automáticamente el tipo de usuario
            const esPsicologo = usuario.esPsicologo;
            const role = esPsicologo ? 'psicologo' : 'paciente';

            // Generar tokens sin usar sesiones de Passport
            if (esPsicologo) {
                const accessToken = cookieCtrl.signAccess({ id: usuario.idUsuario, role });
                const refreshToken = cookieCtrl.signRefresh({ id: usuario.idUsuario, role });
                cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
                console.log(usuario.suscripcion?.plan);

                return res.status(200).json({
                    success: true,
                    //idPsicologo: usuario.idUsuario,
                    idUsuario: usuario.idUsuario,
                    email: email,
                    nombre: usuario.nombre,
                    role: 'psicologo',
                    suscripcion: usuario.suscripcion?.plan || 'Plan Gratuito',
                    fotoPerfil: usuario.fotoPerfil,
                    token: accessToken,
                });
            }

            const accessToken = cookieCtrl.signAccess({ id: usuario.idUsuario, role: 'paciente' });
            const refreshToken = cookieCtrl.signRefresh({ id: usuario.idUsuario, role: 'paciente' });
            cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
            res.clearCookie('token');
            return res.status(200).json({
                success: true,
                //idPaciente: usuario.idUsuario,
                idUsuario: usuario.idUsuario,
                email: email,
                nombre: usuario.nombre,
                role: 'paciente',
                fotoPerfil: usuario.fotoPerfil,
                token: accessToken,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }
    }

    /**
     * Login de psicólogo
     * DEPRECATED: Esta función puede ser eliminada. Usar loginUnificado() en su lugar
     */
    loginPsicologo = async (req, res) => {
        return this.loginUsuario(req, res, true);
    }

    /**
     * Login de paciente
     * DEPRECATED: Esta función puede ser eliminada. Usar loginUnificado() en su lugar
     */
    loginPaciente = async (req, res) => {
        return this.loginUsuario(req, res, false);
    }

    /**
     * Vincular pacientes a un psicólogo
     */
    async vincularPacientes(req, res) {
        const idPsicologo = req.params.idPsicologo;
        const { idPaciente } = req.body;
        const listaVinculacionModel = new ListaVinculacion();
        const usuarioModel = new Usuario();

        try {
            // Validar que ambos IDs estén presentes
            if (!idPsicologo || !idPaciente) {
                return res.status(400).json({
                    success: false,
                    message: 'ID del psicólogo y del paciente son requeridos'
                });
            }

            if (!req.user?.idUsuario) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            if (!req.user.esPsicologo) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo un psicólogo puede vincular pacientes desde esta ruta'
                });
            }

            if (req.user.idUsuario.toString() !== idPsicologo.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No puedes vincular pacientes para otro psicólogo'
                });
            }

            if (idPsicologo.toString() === idPaciente.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes vincularte contigo mismo'
                });
            }

            const paciente = await usuarioModel.findById(idPaciente);
            if (!paciente) {
                return res.status(404).json({
                    success: false,
                    message: 'Paciente no encontrado'
                });
            }

            if (paciente.esPsicologo) {
                return res.status(400).json({
                    success: false,
                    message: 'El UID ingresado corresponde a un psicólogo, no a un paciente'
                });
            }

            // Validar que no exista vinculación previa
            const vinculacionExistente = await listaVinculacionModel.findVinculacion(idPsicologo, idPaciente);
            if (vinculacionExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Este paciente ya está vinculado a este psicólogo'
                });
            }

            await listaVinculacionModel.create(idPsicologo, idPaciente);
            res.status(201).json({
                success: true,
                message: 'Paciente vinculado exitosamente'
            });
        } catch (error) {
            console.error('Error en vincularPacientes:', error);

            // Validar si es un error por ID inválido
            if (error.message.includes('ID') || error.message.includes('inválido')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al vincular el paciente: ' + error.message
            });
        }
    }

    /**
     * Vincular psicólogo a un paciente
     */
    async vincularPsicologo(req, res) {
        const idPaciente = req.params.idPaciente;
        const { idPsicologo } = req.body;
        const listaVinculacionModel = new ListaVinculacion();
        const usuarioModel = new Usuario();

        try {
            // Validar que ambos IDs estén presentes
            if (!idPaciente || !idPsicologo) {
                return res.status(400).json({
                    success: false,
                    message: 'ID del paciente y del psicólogo son requeridos'
                });
            }

            if (!req.user?.idUsuario) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            if (req.user.esPsicologo) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo un paciente puede vincular psicólogos desde esta ruta'
                });
            }

            if (req.user.idUsuario.toString() !== idPaciente.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No puedes vincular psicólogos para otro paciente'
                });
            }

            if (idPaciente.toString() === idPsicologo.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes vincularte contigo mismo'
                });
            }

            const psicologo = await usuarioModel.findById(idPsicologo);
            if (!psicologo) {
                return res.status(404).json({
                    success: false,
                    message: 'Psicólogo no encontrado'
                });
            }

            if (!psicologo.esPsicologo) {
                return res.status(400).json({
                    success: false,
                    message: 'El UID ingresado corresponde a un paciente, no a un psicólogo'
                });
            }

            // Validar que no exista vinculación previa
            const vinculacionExistente = await listaVinculacionModel.findVinculacion(idPsicologo, idPaciente);
            if (vinculacionExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'Este psicólogo ya está vinculado a este paciente'
                });
            }

            await listaVinculacionModel.create(idPsicologo, idPaciente);
            res.status(201).json({
                success: true,
                message: 'Psicologo vinculado exitosamente'
            });
        } catch (error) {
            console.error('Error en vincularPsicologo:', error);

            // Validar si es un error por ID inválido
            if (error.message.includes('ID') || error.message.includes('inválido')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al vincular el psicologo: ' + error.message
            });
        }
    }

    /**
     * Obtener pacientes vinculados a un psicólogo
     */
    async obtenerPacientesVinculados(req, res) {
        const { idPsicologo } = req.params;
        const listaVinculacionModel = new ListaVinculacion();
        try {
            const data = await listaVinculacionModel.findByPsicologo(idPsicologo);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al obtener pacientes: ' + error.message });
        }
    }

    /**
     * Obtener psicólogos vinculados a un paciente
     */
    async obtenerPsicologosVinculados(req, res) {
        const { idPaciente } = req.params;
        const listaVinculacionModel = new ListaVinculacion();
        try {
            const data = await listaVinculacionModel.findByPaciente(idPaciente);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al obtener psicologos: ' + error.message });
        }
    }

    /**
     * Probar la conexión con la base de datos
     */
    async probarConexion(req, res) {
        try {
            const usuarioModel = new Usuario();
            // Implementar según necesidad
            res.status(200).json({ success: true, message: 'Conexión exitosa' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Obtener información del usuario actual (sesión activa)
     */
    getMe = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'No autenticado' });
            }

            // El protector puede devolver solo el payload del token o el usuario completo.
            const userId = req.user.idUsuario || req.user.id;
            const isPsicologo = req.user.esPsicologo ?? req.user.role === 'psicologo';

            const userData = {
                id: userId,
                idUsuario: userId,
                nombre: req.user.nombre,
                email: req.user.email,
                fotoPerfil: req.user.fotoPerfil,
                role: isPsicologo ? 'psicologo' : 'paciente',
                plan: req.user.plan || req.user.suscripcion?.plan || 'Plan Gratuito',
            };

            res.status(200).json({
                success: true,
                user: userData
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Cerrar sesión
     */
    logout = async (req, res) => {
        try {
            // Limpiar cookies de autenticación
            res.clearCookie('token');
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.clearCookie('connect.sid'); // Cookie de sesión de Passport

            res.status(200).json({ success: true, message: 'Sesión cerrada' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Refrescar token de acceso
     */
    refresh = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ success: false, message: 'Token de refresco no proporcionado' });
            }

            // Verificar el refresh token y generar nuevo access token
            const accessSecret = process.env.ACCESS_SECRET || 'default_secret';
            const refreshSecret = process.env.REFRESH_SECRET || 'default_refresh_secret';

            const decoded = jwt.verify(refreshToken, refreshSecret);
            const usuarioModel = new Usuario();
            const usuario = await usuarioModel.findById(decoded.id);

            if (!usuario) {
                return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
            }

            const role = usuario.esPsicologo ? 'psicologo' : 'paciente';
            const accessToken = cookieCtrl.signAccess({ id: decoded.id, role });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.STAGE === 'production',
                sameSite: process.env.STAGE === 'production' ? 'None' : 'Lax',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            res.status(200).json({
                success: true,
                idUsuario: usuario.idUsuario,
                email: usuario.email,
                nombre: usuario.nombre,
                role,
                suscripcion: usuario.suscripcion?.plan || '',
                token: accessToken,
            });
        } catch (error) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        }
    }

    /**
     * Actualizar perfil del usuario
     */
    async actualizarPerfil(req, res) {
        try {
            const { id } = req.params;
            const datosActualizar = req.body;

            // El middleware protector asigna req.user con el objeto usuario completo
            const userIdFromToken = req.user.idUsuario.toString();

            // Validar que el usuario esté actualizando su propio perfil
            if (userIdFromToken !== id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para actualizar este perfil'
                });
            }

            const usuarioModel = new Usuario();

            if (typeof datosActualizar.nombre === 'string' && datosActualizar.nombre.trim().length > 45) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre no puede tener más de 45 caracteres'
                });
            }

            // Si se está actualizando el email, verificar que no exista
            if (datosActualizar.email) {
                const email = datosActualizar.email.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Correo electrónico inválido'
                    });
                }

                const emailExistente = await usuarioModel.findByEmail(datosActualizar.email);
                if (emailExistente && emailExistente.idUsuario.toString() !== id) {
                    return res.status(400).json({
                        success: false,
                        message: 'El correo ya está en uso'
                    });
                }
            }

            const actualizado = await usuarioModel.actualizarPerfil(id, datosActualizar);
            const listaVinculacionModel = new ListaVinculacion();
            await listaVinculacionModel.actualizarNombreEnVinculaciones(id, datosActualizar.nombre);

            if (actualizado) {
                const usuarioActualizado = await usuarioModel.findById(id);
                return res.status(200).json({
                    success: true,
                    message: 'Perfil actualizado exitosamente',
                    data: {
                        id: usuarioActualizado.idUsuario,
                        nombre: usuarioActualizado.nombre,
                        email: usuarioActualizado.email,
                        fotoPerfil: usuarioActualizado.fotoPerfil,
                        telefono: usuarioActualizado.telefono,
                        apellido: usuarioActualizado.apellido
                    }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el perfil'
                });
            }

        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar perfil: ' + error.message
            });
        }
    }

    //Actualizar la lista de vinculacion con el nuevo nombre del usuario
    async actualizarListaVinculacion(req, res) {
        try {
            const { idPsicologo, idPaciente } = req.body;
            const listaVinculacionModel = new ListaVinculacion();
            const actualizado = await listaVinculacionModel.actualizarVinculacion(idPsicologo, idPaciente);

            if (actualizado) {
                return res.status(200).json({
                    success: true,
                    message: 'Lista de vinculacion actualizada exitosamente'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la lista de vinculacion'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar lista de vinculacion: ' + error.message
            });
        }
    }

    //Guadar Horario del psicologo
    async guardarHorario(req, res) {
        const usuarioModel = new Usuario();
        try {
            const idUsuario = req.user?.idUsuario;
            const { horario } = req.body;
            if (!idUsuario || !horario) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario y horario son requeridos'
                });
            }
            const ok = await usuarioModel.actualizarPerfil(idUsuario, { horario });
            if (!ok) {
                console.error('Error al guardar el horario: No se pudo actualizar el perfil');
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo guardar el horario'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Horario guardado exitosamente'
                });
            }
        } catch (error) {
            console.error('Error al guardar el horario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar el horario: ' + error.message
            });
        }
    }
    // Obtener el horario de un psicólogo
    async obtenerHorario(req, res) {
        const usuarioModel = new Usuario();
        try {
            const idUsuario = req.params.idUsuario;
            if (!idUsuario) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario es requerido'
                });
            }
            const horario = await usuarioModel.obtenerHorario(idUsuario);
            if (horario) {
                return res.status(200).json({
                    success: true,
                    data: {
                        horario: horario
                    }
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Horario no encontrado para el usuario'
                });
            }
        } catch (error) {
            console.error('Error al obtener horario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener horario: ' + error.message
            });
        }
    }
    // Obtener perfil de un usuario por ID
    async obtenerPerfil(req, res) {
        try {
            const { id } = req.params;

            const usuarioModel = new Usuario();
            const usuario = await usuarioModel.findById(id);

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    id: usuario.idUsuario,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    fotoPerfil: usuario.fotoPerfil,
                    telefono: usuario.telefono,
                    apellido: usuario.apellido,
                    esPsicologo: usuario.esPsicologo
                }
            });
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener perfil: ' + error.message
            });
        }
    }

    // Actualizar foto de perfil
    async cambiarFotoPerfil(req, res) {
        try {
            const idUsuario = req.user?.idUsuario;
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó una imagen'
                });
            }

            const usuarioModel = new Usuario();
            const usuario = await usuarioModel.findById(idUsuario);

            // ELIMINAR FOTO ANTERIOR SI EXISTE
            if (usuario?.fotoPerfil && !usuario.fotoPerfil.startsWith('http')) {
                console.log('Intentando eliminar foto anterior:', usuario.fotoPerfil);
                const fotoAnterior = path.join(path.resolve(), usuario.fotoPerfil);

                try {
                    await fs.promises.unlink(fotoAnterior);
                    console.log('Foto anterior eliminada:', fotoAnterior);
                } catch (error) {
                    if (error.code === 'ENOENT') {
                        console.warn('Foto anterior no encontrada, no se pudo eliminar:', fotoAnterior);
                    }
                }
            }

            const relativePath = path.relative(path.resolve(), req.file.path).replace(/\\/g, '/');
            const actualizado = await usuarioModel.cambiarFotoPerfil(idUsuario, relativePath);
            const listaVinculacionModel = new ListaVinculacion();
            await listaVinculacionModel.actualizarFotoEnVinculaciones(idUsuario, relativePath);
            if (actualizado) {
                return res.status(200).json({
                    success: true,
                    message: 'Foto de perfil actualizada exitosamente',
                    fotoPerfil: relativePath
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la foto de perfil'
                });
            }
        }
        catch (error) {
            console.error('Error al actualizar foto de perfil:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar foto de perfil: ' + error.message
            });
        }
    }

    async eliminarCuenta(req, res) {
        try {
            const idUsuario = req.user?.idUsuario;
            const usuarioModel = new Usuario();
            const listaVinculacionModel = new ListaVinculacion();
            const chatModel = new Chat();
            const citaModel = new Cita();
            const agendaModel = new Agenda();

            if (!idUsuario) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario es requerido'
                });
            }

            const usuario = await usuarioModel.findById(idUsuario);
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            const archivosLocales = new Set();

            if (usuario.fotoPerfil && typeof usuario.fotoPerfil === 'string' && !usuario.fotoPerfil.startsWith('http')) {
                archivosLocales.add(usuario.fotoPerfil);
            }

            const [vinculacionesEliminadas, chatsEliminados, citasEliminadas, agendaEliminada] = await Promise.all([
                listaVinculacionModel.eliminarPorUsuario(idUsuario),
                chatModel.eliminarPorUsuario(idUsuario),
                citaModel.eliminarPorUsuario(idUsuario),
                agendaModel.eliminarPorUsuario(idUsuario)
            ]);

            for (const archivoPath of chatsEliminados.archivos) {
                archivosLocales.add(archivoPath);
            }

            for (const archivoRelativo of archivosLocales) {
                const filePath = path.resolve(path.resolve(), archivoRelativo);

                try {
                    if (fs.existsSync(filePath)) {
                        await fs.promises.unlink(filePath);
                    }
                } catch (error) {
                    if (error.code !== 'ENOENT') {
                        console.warn('No se pudo eliminar archivo vinculado:', filePath, error.message);
                    }
                }
            }

            const eliminado = await usuarioModel.eliminarCuenta(idUsuario);
            if (eliminado) {
                // Limpiar cookies de autenticación
                res.clearCookie('token');
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                res.clearCookie('connect.sid'); // Cookie de sesión de Passport
                return res.status(200).json({
                    success: true,
                    message: 'Cuenta eliminada exitosamente',
                    cascade: {
                        vinculacionesEliminadas,
                        chatsEliminados: chatsEliminados.deletedCount,
                        citasEliminadas,
                        agendaEliminada
                    }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la cuenta'
                });
            }

        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar cuenta: ' + error.message
            });
        }
    }


}

export default new UsuarioController;