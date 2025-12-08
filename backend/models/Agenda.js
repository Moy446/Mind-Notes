import dbClient from "../config/dbclient.js";

class Agenda {
    constructor(){

    }
    async create(datosAgenda){
        colAgenda = dbClient.db.collection('agenda');
        const resultado = await colAgenda.insertOne(datosAgenda);
        return resultado;
    }
}

export default Agenda;