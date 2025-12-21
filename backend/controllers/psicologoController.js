import ListaPaciente from "../models/ListaPaciente.js";
import Psicologo from "../models/Psicologo.js";

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
        const allData = { nombre, apellido, email, password, cedula } = req.body;
        const modelPsicologo = new Psicologo();
        const resultado = await modelPsicologo.create(allData);
        res.status(201).json(resultado);
    }

}

export default new PsicologoController;