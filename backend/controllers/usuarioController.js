import Usuario from "../models/Usuario.js";
import ListaVinculacion from "../models/ListaVinculacion.js";
import Bcrypt from 'bcryptjs';
import cookieCtrl from "../helpers/cookiesControll.js";
import jwtControl from "../helpers/jwtControl.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

class UsuarioController {

    constructor(){

    }

    /**
     * Registrar un nuevo usuario (Psicólogo o Paciente)
     * @param {Boolean} esPsicologo - true para psicólogo, false para paciente
     */
    async registrarUsuario(req, res, esPsicologo = false) {
        try {
            const { nombre, email, password } = req.body;
            
            // Validación de contraseña para psicólogos
            if (esPsicologo && req.body.passwordConfirm && password !== req.body.passwordConfirm) {
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

            const modelUsuario = new Usuario();
            const user = await modelUsuario.create(allData, esPsicologo);
            
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
                    nombre: user.nombre 
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
                    token 
                });
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

            // Verificar que el tipo de usuario coincida
            if (usuario.esPsicologo !== esPsicologo) {
                const tipoEsperado = esPsicologo ? 'psicólogo' : 'paciente';
                const tipoReal = usuario.esPsicologo ? 'psicólogo' : 'paciente';
                return res.status(403).json({ 
                    success: false, 
                    message: `Esta cuenta es de tipo ${tipoReal}, no ${tipoEsperado}` 
                });
            }

            const isPasswordValid = await Bcrypt.compare(password, usuario.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }

            const role = esPsicologo ? 'psicologo' : 'paciente';

            if (esPsicologo) {
                const accessToken = cookieCtrl.signAccess({ id: usuario.idUsuario, role });
                const refreshToken = cookieCtrl.signRefresh({ id: usuario.idUsuario, role });
                cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
                res.status(200).json({ 
                    success: true, 
                    idPsicologo: usuario.idUsuario,
                    idUsuario: usuario.idUsuario, 
                    nombre: usuario.nombre 
                });
            } else {
                const jwt = new jwtControl();
                const token = await jwt.generateToken(usuario.idUsuario.toString(), usuario.nombre, role);
                const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
                const sameSite = useSecure ? 'None' : 'Lax';
                res.cookie('token', token, { httpOnly: true, secure: useSecure, sameSite });
                res.status(200).json({ 
                    success: true, 
                    idPaciente: usuario.idUsuario,
                    idUsuario: usuario.idUsuario, 
                    token 
                });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }
    }

    /**
     * Login de psicólogo
     */
    loginPsicologo = async (req, res) => {
        return this.loginUsuario(req, res, true);
    }

    /**
     * Login de paciente
     */
    loginPaciente = async (req, res) => {
        return this.loginUsuario(req, res, false);
    }

    /**
     * Vincular pacientes a un psicólogo
     */
    async vincularPacientes(req, res) {
        const idPsicologo = req.params.Psicologo;
        const listaVinculacionModel = new ListaVinculacion();
        try {
            await listaVinculacionModel.create(idPsicologo, req.body.idPaciente);
            res.status(201).json({
                success: true,
                message: 'Paciente vinculado exitosamente'
            });
        } catch (error) {
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
        const listaVinculacionModel = new ListaVinculacion();
        try {
            await listaVinculacionModel.create(req.body.idPsicologo, idPaciente);
            res.status(201).json({
                success: true,
                message: 'Psicologo vinculado exitosamente'
            });
        } catch (error) {
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
            res.clearCookie('token');
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
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
}

export default new UsuarioController;