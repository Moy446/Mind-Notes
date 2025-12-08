import dbClient from "../config/dbclient.js";

class Paciente {
    constructor(){

    }
    async create(datosUsuario){
        colPacientes = dbClient.db.collection('pacientes');
        const resultado = await colPacientes.insertOne(datosUsuario);
        return resultado;
    }
}

export default Paciente;