import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Paciente from '../models/Paciente';
import Psicologo from '../models/Psicologo';

export default class routesProtect {
    constructor() {
    }
    async protector(req,res,next){
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Acceso denegado. Token no proporcionado.' }), res.redirect('/login');
        }
        try { 
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const pacienteModel = new Paciente();
            const psicologoModel = new Psicologo();
            const userPaciente = await pacienteModel.getUserById(decode.idPaciente);
            const userPsicologo = await psicologoModel.getUserById(decode.idPsicologo);
            if (!userPaciente && !userPsicologo) {
                res.clearCookie('token');
                return res.status(401).json({ success: false, message: 'Acceso denegado. Usuario no encontrado.' });
            }
            req.user = userPaciente || userPsicologo;
            next();
        }   catch (error) {
            res.clearCookie('token');
            return res.status(400).json({ success: false, message: 'Token inválido.' }), res.redirect('/login');
    }   
}
}