import ListaPaciente from "../models/ListaPaciente.js";
import Psicologo from "../models/Psicologo.js";
import Bcrypt from 'bcryptjs';

class PsicologoController {
    constructor(){

    }
    //Funcion para probar la conexion con la base de datos
    async probarConexion(req, res) {
        const listaPaciente = new ListaPaciente();
        const data = await listaPaciente.selectAll();
        res.status(200).json(data);
    }
    //Funcion para registrar un nuevo psicologo en la base de datos
    async registrarPsicologoBD(req, res) {

        const allData = {
                Password: req.body.password,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                fechaInicio: req.body.fechaInicio,
                fechaFin: req.body.fechaFin,
                cedula: req.body.cedula,
                email: req.body.email,
                fotoPerfil:req.body.fotoPerfil};
        const modelPsicologo = new Psicologo();
        const resultado = await modelPsicologo.create(allData);
        res.status(201).json(resultado);
    }
    //Funcion para listar los pacientes asociados a un psicologo
    async vincularPacientes(req, res) {
        const idPsicologo = req.params.Psicologo;
        const listaPacienteModel = new ListaPaciente();
        try {
            listaPacienteModel.create(req.body.idPaciente, idPsicologo);
            res.status(201).json({
                success: true,
                message: 'Paciente vinculado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al vincular el paciente: ' + error.message
            });
        }
    }

}

export default new PsicologoController;