import Usuario from "../models/Usuario.js";
import ListaVinculacion from "../models/ListaVinculacion.js";
import Bcrypt from 'bcryptjs';
import cookieCtrl from "../helpers/cookiesControll.js";
import jwtControl from "../helpers/jwtControl.js";
import emailService from "../helpers/emailService.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';
import { li } from "framer-motion/client";

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
                    const jwt = new jwtControl();
                    const token = await jwt.generateToken(user.idUsuario.toString(), nombre, role);
                    const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
                    const sameSite = useSecure ? 'None' : 'Lax';
                    res.cookie('token', token, { httpOnly: true, secure: useSecure, sameSite });
                    res.status(201).json({
                        success: true,
                        idPaciente: user.idUsuario,
                        idUsuario: user.idUsuario,
                        token,
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
                    return res.status(200).json({
                        success: true,
                        idPsicologo: usuario.idUsuario,
                        idUsuario: usuario.idUsuario,
                        nombre: usuario.nombre
                    });
                }

                const jwt = new jwtControl();
                const token = await jwt.generateToken(usuario.idUsuario.toString(), usuario.nombre, role);
                const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
                const sameSite = useSecure ? 'None' : 'Lax';
                res.cookie('token', token, { httpOnly: true, secure: useSecure, sameSite });
                return res.status(200).json({
                    success: true,
                    idPaciente: usuario.idUsuario,
                    idUsuario: usuario.idUsuario,
                    token
                });
            };

            if (typeof req.login === 'function') {
                return req.login(usuario, (err) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Error al iniciar sesión'
                        });
                    }

                    return respond();
                });
            }

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
                return res.status(200).json({
                    success: true,
                    idPsicologo: usuario.idUsuario,
                    idUsuario: usuario.idUsuario,
                    nombre: usuario.nombre,
                    role: 'psicologo'
                });
            }

            const jwt = new jwtControl();
            const token = await jwt.generateToken(usuario.idUsuario.toString(), usuario.nombre, role);
            const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
            const sameSite = useSecure ? 'None' : 'Lax';
            res.cookie('token', token, { httpOnly: true, secure: useSecure, sameSite });
            return res.status(200).json({
                success: true,
                idPaciente: usuario.idUsuario,
                idUsuario: usuario.idUsuario,
                token,
                role: 'paciente'
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
        
        try {
            // Validar que ambos IDs estén presentes
            if (!idPsicologo || !idPaciente) {
                return res.status(400).json({
                    success: false,
                    message: 'ID del psicólogo y del paciente son requeridos'
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
        
        try {
            // Validar que ambos IDs estén presentes
            if (!idPaciente || !idPsicologo) {
                return res.status(400).json({
                    success: false,
                    message: 'ID del paciente y del psicólogo son requeridos'
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

            // Remover campos sensibles
            const { password, ...userSafe } = req.user;

            const userData = {
                id: userSafe.idUsuario,
                nombre: userSafe.nombre,
                email: userSafe.email,
                fotoPerfil: userSafe.fotoPerfil,
                telefono: userSafe.telefono,
                role: userSafe.esPsicologo ? 'psicologo' : 'paciente',
                plan: userSafe.plan || 'Plan Gratuito',
                apellido: userSafe.apellido,
                cedula: userSafe.cedula
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
            
            // Logout de Passport si el usuario está autenticado
            if (typeof req.logout === 'function' && req.session) {
                req.logout((err) => {
                    if (err) {
                        console.error('Error en logout de Passport:', err);
                    }
                });
            }

            // Destruir sesión de Passport si existe
            if (req.session) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Error al destruir sesión:', err);
                    }
                });
            }
            
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
            const accessToken = cookieCtrl.signAccess({ id: decoded.id, role: decoded.role });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            res.status(200).json({ success: true, message: 'Token renovado' });
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

            // Si se está actualizando el email, verificar que no exista
            if (datosActualizar.email) {
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
    async guardarHorario(req,res){
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
        const ok = await usuarioModel.actualizarPerfil(idUsuario, {horario});
        if (ok) {
            return res.status(200).json({
                success: true,
                message: 'Horario guardado exitosamente'
            });
        } else {
            console.error('Error al guardar el horario: No se pudo actualizar el perfil');  
            return res.status(400).json({
                success: false,
                message: 'No se pudo guardar el horario'
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
}

export default new UsuarioController;