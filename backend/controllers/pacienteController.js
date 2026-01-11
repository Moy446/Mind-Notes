import { ObjectId } from "mongodb";
import Paciente from "../models/Paciente.js";
import ListaPsicologo from "../models/ListaPsicologo.js";
class PacienteController {
    constructor() {
    }
    async registrarPacienteBD(req, res) {
        const allData = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password,
            telefono: req.body.telefono,
            fotoPerfil: req.body.fotoPerfil
        };
        const modelPaciente = new Paciente();
        const resultado = await modelPaciente.create(allData);
        res.status(201).json(resultado);
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
            res.status(200).json({ success: true, idPaciente: paciente.idPaciente });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }

    }

    async vincularPsicologo(req, res) {
        const idPaciente = req.params.idPaciente;
        const listaPsicologoModel = new ListaPsicologo();
        try {
            listaPsicologoModel.create(idPaciente, req.body.idPsicologo);
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