import ListaPaciente from "../models/ListaPaciente.js";

class PsicologoController {
    constructor(){

    }
    async probarConexion(req, res) {
        const listaPaciente = new ListaPaciente();
        const data = await listaPaciente.selectAll();
        res.status(200).json(data);
    }
}

export default new PsicologoController;