import dbClient from "../config/dbclient.js";

class Cita {
    constructor(){

    }
    async create(datosCita){
        colCita = dbClient.db.collection('citas');
        const resultado = await colCita.insertOne(datosCita);
        return resultado;
    }
}

export default Cita;