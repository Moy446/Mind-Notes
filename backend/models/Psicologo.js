import dbClient from "../config/dbclient.js";

class Psicologo {
    constructor(){

    }
    async create(datosUsuario){
        colPsicologos = dbClient.db.collection('psicologos');
        const resultado = await colPsicologos.insertOne(datosUsuario);
        return resultado;
    }
}

export default Psicologo;