import express from 'express';
import authController from '../controllers/authController.js';

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

export default router;
