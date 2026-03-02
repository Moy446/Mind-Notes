import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Usuario from '../models/Usuario.js';

export default async function protector(req, res, next) {
    // Soporta tokens de pacientes (cookie `token`) y de psicólogos (cookie `accessToken`).
    const legacyToken = req.cookies.token;
    const accessToken = req.cookies.accessToken;
    const token = legacyToken || accessToken;

 

    if (!token) {
        return res.status(401).json({ success: false, message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Usar los mismos secretos (con fallback) que las funciones que generan los tokens.
        const jwtSecret = process.env.JWT_SECRET;
        const accessSecret = process.env.ACCESS_SECRET || 'default_secret';
        const secret = legacyToken ? jwtSecret : accessSecret;
        const decoded = jwt.verify(token, secret);
        const usuarioModel = new Usuario();

        let user = null;
        // Buscar el usuario por ID independientemente del rol
        user = await usuarioModel.findById(decoded.id);

        if (!user) {
            res.clearCookie('token');
            res.clearCookie('accessToken');
            return res.status(401).json({ success: false, message: 'Acceso denegado. Usuario no encontrado.' });
        }

        // Verificar que el rol coincida con el tipo de usuario
        
        if (decoded.role === 'paciente' && user.esPsicologo) {
            res.clearCookie('token');
            res.clearCookie('accessToken');
            return res.status(403).json({ success: false, message: 'Acceso denegado. Tipo de usuario incorrecto.' });
        }
        if (decoded.role === 'psicologo' && !user.esPsicologo) {
            res.clearCookie('token');
            res.clearCookie('accessToken');
            return res.status(403).json({ success: false, message: 'Acceso denegado. Tipo de usuario incorrecto.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.clearCookie('accessToken');
        return res.status(400).json({ success: false, message: 'Token inválido.' });
    }
}