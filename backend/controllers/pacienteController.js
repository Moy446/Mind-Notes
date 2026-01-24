import Paciente from "../models/Paciente.js";
import ListaPsicologo from "../models/ListaPsicologo.js";
import Bcrypt from 'bcryptjs';
import jwtControl from "../helpers/jwtControl.js";

class PacienteController {
    constructor() {
    }
    async registrarPacienteBD(req, res) {
        try {
            const { nombre, email, password } = req.body;
        
            
            const allData = {
                nombre,
                email,
                password,
                telefono: req.body.telefono || '',
                fotoPerfil: req.body.fotoPerfil || ''
            };
            const modelPaciente = new Paciente();
            const resultado = await modelPaciente.create(allData);
            const jwt = new jwtControl();
            const token = await jwt.generateToken(resultado.idPaciente.toString(), nombre, 'paciente');
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.status(201).json({ success: true, idPaciente: resultado.idPaciente, token });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al registrar: ' + error.message });
        }
    }

    //Login de paciente
    async loginPaciente(req, res) {
        try {

            const { email, password } = req.body;
            const modelPaciente = new Paciente();
            const paciente = await modelPaciente.findByEmail(email);
            if (!paciente) {
                return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
            }
            const isPasswordValid = await Bcrypt.compare(password, paciente.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
            const jwt = new jwtControl();
            const token = await jwt.generateToken(paciente.idPaciente.toString(), paciente.nombre, 'paciente');
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.status(200).json({ success: true, idPaciente: paciente.idPaciente, token });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }

    }

    async vincularPsicologo(req, res) {
        const idPaciente = req.params.idPaciente;
        const listaPsicologoModel = new ListaPsicologo();
        try {
            await listaPsicologoModel.create(idPaciente, req.body.idPsicologo);
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
}
export default new PacienteController;