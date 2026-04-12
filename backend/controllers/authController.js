import Usuario from "../models/Usuario.js";
import Bcrypt from 'bcryptjs';
import emailService from "../helpers/emailService.js";
import crypto from 'crypto';
import cookieCtrl from "../helpers/cookiesControll.js";
import 'dotenv/config';

class AuthController {
    constructor() {}

    /**
     * Solicita recuperación de contraseña
     * Genera token temporal y envía correo
     */
    async solicitarRecuperacion(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo es requerido'
                });
            }

            const modelUsuario = new Usuario();
            const usuario = await modelUsuario.findByEmail(email);
            console.log('Usuario encontrado para recuperación:', usuario);
            if (!usuario) {
                return res.status(200).json({
                    success: true,
                    message: 'Si el correo existe, recibirás un email con instrucciones'
                });
            }

            // Generar token aleatorio seguro (32 bytes = 64 caracteres hex)
            const tokenRecuperacion = crypto.randomBytes(32).toString('hex');
            
            // Generar hash del token para almacenar de forma segura
            const tokenHash = crypto.createHash('sha256').update(tokenRecuperacion).digest('hex');
            
            // Token expira en 1 hora
            const expiracion = new Date(Date.now() + 60 * 60 * 1000);

            // Guardar token hasheado y expiración
            await modelUsuario.actualizarTokenRecuperacion(usuario.idUsuario, tokenHash, expiracion);

            // Enviar correo
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const resultado = await emailService.enviarRecuperacion(
                usuario.email,
                usuario.nombre,
                tokenRecuperacion,
                frontendUrl
            );

            if (!resultado.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al enviar el correo. Intenta de nuevo más tarde'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Email de recuperación enviado. Revisa tu bandeja de entrada'
            });

        } catch (error) {
            console.error('Error en solicitarRecuperacion:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Verifica el token de recuperación y cambia la contraseña
     */
    async cambiarPasswordConToken(req, res) {
        try {
            const { token, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Las contraseñas no coinciden'
                });
            }

            if (!token || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Token y contraseña son requeridos'
                });
            }
            // Validar longitud mínima de contraseña (8 caracteres)
            if (newPassword.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 8 caracteres'
                });
            }

            // Generar hash del token para comparar con lo almacenado
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
                
            const modelUsuario = new Usuario();
            const usuario = await modelUsuario.findByRecuperacionToken(tokenHash);

            if (!usuario) {
                return res.status(400).json({
                    success: false,
                    message: 'Token inválido o expirado'
                });
            }

            // Validar que el token no haya expirado
            if (new Date() > usuario.tokenExpiracion) {
                return res.status(400).json({
                    success: false,
                    message: 'El token ha expirado. Solicita uno nuevo'
                });
            }

            // Hash de la nueva contraseña
            const salt = await Bcrypt.genSalt(10);
            const newPasswordHash = await Bcrypt.hash(newPassword, salt);

            // Actualizar contraseña e invalidar token
            await modelUsuario.actualizarPassword(usuario.idUsuario, newPasswordHash);
            await modelUsuario.invalidarTokenRecuperacion(usuario.idUsuario);

            return res.status(200).json({
                success: true,
                message: 'Contraseña actualizada exitosamente. Inicia sesión'
            });

        } catch (error) {
            console.error('Error en cambiarPasswordConToken:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Verifica la cuenta del usuario con token
     */
    async verificarCuenta(req, res) {
        try {
            const { token } = req.params;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token no proporcionado'
                });
            }

            // Generar hash del token
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

            const modelUsuario = new Usuario();
            const usuario = await modelUsuario.findByVerificacionToken(tokenHash);

            if (!usuario) {
                
                return res.status(400).json({
                    success: false,
                    message: 'Token inválido, expirado o ya utilizado. Si tu cuenta ya está verificada, puedes iniciar sesión.'
                });
            }
            
            // Verificar usuario
            await modelUsuario.marcarVerificado(usuario.idUsuario);

            return res.status(200).json({
                success: true,
                message: 'Cuenta verificada exitosamente. Ya puedes iniciar sesión'
            });

        } catch (error) {
            console.error('Error en verificarCuenta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Reenvía el correo de verificación
     */
    async reenviarVerificacion(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo es requerido'
                });
            }

            const modelUsuario = new Usuario();
            const usuario = await modelUsuario.findByEmail(email);

            if (!usuario) {
                return res.status(400).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            if (usuario.verificado) {
                return res.status(400).json({
                    success: false,
                    message: 'Esta cuenta ya está verificada'
                });
            }

            // Generar nuevo token
            const tokenVerificacion = crypto.randomBytes(32).toString('hex');
            const tokenHash = crypto.createHash('sha256').update(tokenVerificacion).digest('hex');

            await modelUsuario.actualizarTokenVerificacion(usuario._id, tokenHash);

            // Enviar correo
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const resultado = await emailService.enviarVerificacion(
                usuario.email,
                usuario.nombre,
                tokenVerificacion,
                frontendUrl
            );

            if (!resultado.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al enviar el correo'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Correo de verificación reenviado'
            });

        } catch (error) {
            console.error('Error en reenviarVerificacion:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    /**
     * Autentica usuarios desde la app móvil usando Google OAuth
     * POST /api/auth/google/mobile
     */
    async googleMobileAuth(req, res) {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                return res.status(400).json({
                    success: false,
                    message: 'ID token de Google es requerido'
                });
            }

            // Decodificar el ID token para extraer información del usuario
            // Nota: En producción, se debe verificar el token usando la librería google-auth-library
            const parts = idToken.split('.');
            if (parts.length !== 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Token inválido'
                });
            }

            let decodedToken;
            try {
                // Decodificar el payload (segunda parte del JWT)
                const payload = parts[1];
                const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
                decodedToken = JSON.parse(decodedPayload);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Token inválido o malformado'
                });
            }

            // Validar que sea un token de Google correcto
            if (decodedToken.iss !== 'https://accounts.google.com' && 
                decodedToken.iss !== 'accounts.google.com') {
                return res.status(400).json({
                    success: false,
                    message: 'Token no es de Google'
                });
            }

            // Acepta audiencias válidas para web y móviles del mismo proyecto OAuth.
            const allowedAudiences = [
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_ANDROID_CLIENT_ID,
                process.env.GOOGLE_IOS_CLIENT_ID,
            ].filter(Boolean);

            if (!allowedAudiences.includes(decodedToken.aud)) {
                return res.status(400).json({
                    success: false,
                    message: 'Token no es para esta aplicación'
                });
            }

            const { email, sub } = decodedToken;

            const usuarioModel = new Usuario();
            
            // Buscar usuario por Google ID
            let usuario = await usuarioModel.findByGoogleId(sub);

            if (!usuario) {
                // Buscar por email
                usuario = await usuarioModel.findByEmail(email);

                if (usuario) {
                    // Actualizar el Google ID si el usuario ya existe
                    await usuarioModel.actualizarGoogleId(usuario.idUsuario, sub);
                } else {
                    return res.status(404).json({
                        success: false,
                        code: 'GOOGLE_ACCOUNT_NOT_REGISTERED',
                        email,
                        message: 'No existe una cuenta con este correo. Registrate primero.'
                    });
                }
            }

            // Generar tokens JWT
            const accessToken = cookieCtrl.signAccess({
                id: usuario.idUsuario,
                role: usuario.esPsicologo ? 'psicologo' : 'paciente'
            });

            const refreshToken = cookieCtrl.signRefresh({
                id: usuario.idUsuario,
                role: usuario.esPsicologo ? 'psicologo' : 'paciente'
            });

            return res.status(200).json({
                success: true,
                message: 'Autenticación exitosa',
                accessToken,
                refreshToken,
                role: usuario.esPsicologo ? 'psicologo' : 'paciente',
                user: {
                    id: usuario.idUsuario,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    fotoPerfil: usuario.fotoPerfil
                }
            });

        } catch (error) {
            console.error('Error en googleMobileAuth:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al autenticar con Google'
            });
        }
    }
}

export default new AuthController();