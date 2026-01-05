import dbClient from "../config/dbClient.js";
import Psicologo from "../models/Psicologo.js";

class ListaPsicologo {
    constructor() {
        this.colListaPsicologo = dbClient.db.collection('listaPsicologos');
    }
    async create(idPaciente, idPsicologo) {
        const psicologo = new Psicologo();
        try {
            const listaPsicologo = {
                idPsicologo: idPsicologo,
                nombrePsicologo: await psicologo.findNameById(idPsicologo),
                idPaciente: idPaciente,                fotoPerfil: null,
                fotoPerfil: null,
                ultimoMensaje: null,
            };
            const resultado = await this.colListaPsicologo.insertOne(listaPsicologo);
            return resultado;
        } catch (error) {
            console.error("Error al crear la lista de psicologos:", error);
            throw error;
        }
    }
    async findPsicologoByIdPaciente(idPaciente) {
        try {
            const listaPsicologos = await this.colListaPsicologo.find({ idPaciente: idPaciente }).toArray();
            return listaPsicologos;
        } catch (error) {
            throw new Error('Error al obtener la lista de psicologos: ' + error.message);
        }
    }
}

export default ListaPsicologo;