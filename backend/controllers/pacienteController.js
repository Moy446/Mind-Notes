import { ObjectId } from "mongodb";
import Paciente from "../models/Paciente.js";
import ListaPsicologo from "../models/ListaPsicologo.js";
class PacienteController {
    constructor(){
    }   
    async registrarPacienteBD(req, res) {
        const allData = {
                nombre: req.body.nombre,
                email: req.body.email,
                password: req.body.password,
                telefono: req.body.telefono,
                fotoPerfil:req.body.fotoPerfil};
        const modelPaciente = new Paciente();
        const resultado = await modelPaciente.create(allData);
        res.status(201).json(resultado);
    }

    async loginPaciente(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const modelPaciente = new Paciente();
        const resultado = await modelPaciente.login(email, password);
        res.status(200).json(resultado);
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