import dbClient from "../config/dbclient.js";

class ListaPaciente {
    constructor(){
        this.colListaPaciente = dbClient.db.collection('listaPacientes');
    }
    async create(datosLista){
        try{
            const listaPaciente = {
                idPaciente : datosLista.idPaciente,
                nombrePaciente: datosLista.nombrePaciente,
                fotoPerfil: datosLista.fotoPerfil || null,
                idPsicologo: datosLista.idPsicologo,
                ultimoMensaje: datosLista.ultimoMensaje || null,
            };
            const resultado = await this.colListaPaciente.insertOne(listaPaciente);
            return resultado;
        } catch (error) {
            console.error("Error al crear la lista de pacientes:", error);
            throw error;
        }
    }
    //BUSCAR A LOS PACIENTES QUE TENGAN ASIGANADO EL MISMO PSICOLOGO
    async findPacienteByIdPsicologo(idPsicologo){
        try {
            const listaPacientes = await this.colListaPaciente.find({idPsicologo: idPsicologo}).toArray();
            return listaPacientes;
        } catch (error) {
            throw new Error('Error al obtener la lista de pacientes: ' + error.message);
        }
    }
}

export default ListaPaciente;