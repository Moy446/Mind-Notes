import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Paciente from '../models/Paciente.js';
import Psicologo from '../models/Psicologo.js';

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
        const pacienteModel = new Paciente();
        const psicologoModel = new Psicologo();

        let user = null;
        if (decoded.role === 'paciente') {
            user = await pacienteModel.findById(decoded.id);
        } else if (decoded.role === 'psicologo') {
            user = await psicologoModel.findById(decoded.id);
        }

        if (!user) {
            res.clearCookie('token');
            res.clearCookie('accessToken');
            return res.status(401).json({ success: false, message: 'Acceso denegado. Usuario no encontrado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.clearCookie('accessToken');
        return res.status(400).json({ success: false, message: 'Token inválido.' });
    }
}