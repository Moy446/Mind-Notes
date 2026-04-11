import express from 'express';
import authController from '../controllers/authController.js';
import passport from 'passport';
import cookieCtrl from '../helpers/cookiesControll.js';

const router = express.Router();

/**
 * POST /api/auth/solicitar-recuperacion
 * Solicita recuperación de contraseña
 * Body: { email: string }
 * Response: { success: boolean, message: string }
 */
router.post('/solicitar-recuperacion', (req, res) => 
    authController.solicitarRecuperacion(req, res)
);

/**
 * POST /api/auth/cambiar-password
 * Cambia la contraseña con token válido
 * Body: { token: string, newPassword: string, confirmPassword: string }
 * Response: { success: boolean, message: string }
 */
router.post('/cambiar-password/', (req, res) => 
    authController.cambiarPasswordConToken(req, res)
);

/**
 * GET /api/auth/verificar-cuenta/:token
 * Verifica la cuenta del usuario
 * Params: token (string)
 * Response: { success: boolean, message: string }
 */
router.get('/verificar-cuenta/:token', (req, res) => 
    authController.verificarCuenta(req, res)
);

/**
 * POST /api/auth/reenviar-verificacion
 * Reenvía el correo de verificación
 * Body: { email: string }
 * Response: { success: boolean, message: string }
 */
router.post('/reenviar-verificacion', (req, res) => 
    authController.reenviarVerificacion(req, res)
);

/**
 * GET /api/auth/google
 * Inicia autenticación con Google
 */
router.get('/google', 
    (req, res, next) => {
        const requestedRole = req.query.role === 'psicologo' ? 'psicologo' : 'paciente';
        const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
        const sameSite = useSecure ? 'None' : 'Lax';

        // Guarda el rol seleccionado para usarlo al crear cuentas nuevas por Google.
        res.cookie('google_role', requestedRole, {
            httpOnly: true,
            secure: useSecure,
            sameSite,
            maxAge: 10 * 60 * 1000
        });

        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

/**
 * GET /api/auth/google/callback
 * Callback de Google OAuth2
 */
router.get('/google/callback',
    (req, res, next) => {
        passport.authenticate('google', { session: false }, (error, usuario, info) => {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
            const sameSite = useSecure ? 'None' : 'Lax';

            res.clearCookie('google_role', { httpOnly: true, secure: useSecure, sameSite });

            if (error) {
                console.error('Error en Google callback:', error);
                return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
            }

            if (!usuario) {
                const isNotRegistered = info?.code === 'GOOGLE_ACCOUNT_NOT_REGISTERED';
                const errorCode = isNotRegistered ? 'google_not_registered' : 'google_auth_failed';
                const emailQuery = info?.email ? `&email=${encodeURIComponent(info.email)}` : '';
                return res.redirect(`${frontendUrl}/login?error=${errorCode}${emailQuery}`);
            }

            req.user = usuario;
            return next();
        })(req, res, next);
    },
    (req, res) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        try {
            const usuario = req.user;
            const role = usuario.esPsicologo ? 'psicologo' : 'paciente';
            
            // Generar tokens y establecer cookies
            const accessToken = cookieCtrl.signAccess({ 
                id: usuario.idUsuario, 
                role 
            });
            const refreshToken = cookieCtrl.signRefresh({ 
                id: usuario.idUsuario, 
                role 
            });
            
            // Establecer cookies en la respuesta
            cookieCtrl.setAuthCookies(res, accessToken, refreshToken);

            // Redirigir al chat según el rol con id en URL
            res.redirect(`${frontendUrl}/${role}/chat/${usuario.idUsuario}`);
        } catch (error) {
            console.error('Error en Google callback:', error);
            res.redirect(`${frontendUrl}/login?error=callback_error`);
        }
    }
);

/**
 * POST /api/auth/google/mobile
 * Autentica usuarios desde la app móvil con Google OAuth
 * Body: { idToken: string, role: 'paciente' | 'psicologo' }
 * Response: { success: boolean, accessToken: string, refreshToken: string, role: string, user: object }
 */
router.post('/google/mobile', (req, res) =>
    authController.googleMobileAuth(req, res)
);

export default router;
