import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Paciente from '../models/Paciente.js';
import Psicologo from '../models/Psicologo.js';

export default async function protector(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Acceso denegado. Token no proporcionado.' });
    }
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
            return res.status(401).json({ success: false, message: 'Acceso denegado. Usuario no encontrado.' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(400).json({ success: false, message: 'Token inválido.' });
    }
}