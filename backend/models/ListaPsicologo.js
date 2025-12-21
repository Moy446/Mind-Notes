import dbClient from "../config/dbclient.js";

class ListaPsicologo {
    constructor(){
        this.colListaPsicologo = dbClient.db.collection('listaPsicologos');
    }
    async create(datosLista){
        try{
            const listaPsicologo = {
                idPsicologo : datosLista.idPsicologo,
                nombrePsicologo: datosLista.nombrePsicologo,
                fotoPerfil: datosLista.fotoPerfil || null,
                idPaciente: datosLista.idPaciente,
                ultimoMensaje: datosLista.ultimoMensaje || null,
            };
            const resultado = await this.colListaPsicologo.insertOne(listaPsicologo);
            return resultado;
        } catch (error) {
            console.error("Error al crear la lista de psicologos:", error);
            throw error;
        }
    }
    async findPsicologoByIdPaciente(idPaciente){
        try {
            const listaPsicologos = await this.colListaPsicologo.find({idPaciente: idPaciente}).toArray();
            return listaPsicologos;
        } catch (error) {
            throw new Error('Error al obtener la lista de psicologos: ' + error.message);
        }
    }
}

export default ListaPsicologo;