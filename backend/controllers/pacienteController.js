import Paciente from "../models/Paciente.js";
import ListaVinculacion from "../models/ListaVinculacion.js";
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
            const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
            const sameSite = useSecure ? 'None' : 'Lax';
            res.cookie('token', token, { httpOnly: true, secure: useSecure, sameSite });
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
            const useSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
            const sameSite = useSecure ? 'None' : 'Lax';
            res.cookie('token', token, { httpOnly: true, secure: useSecure, sameSite });
            res.status(200).json({ success: true, idPaciente: paciente.idPaciente, token });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }

    }

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

    // NUEVO: obtener psicólogos vinculados a un paciente
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
}
export default new PacienteController;