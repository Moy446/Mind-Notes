import dbClient from "../config/dbclient.js";

class ListaPaciente {
    constructor(){

    }
    async selectAll(){
        colListaPaciente = dbClient.db.collection('listaPacientes');
        return await colListaPaciente.find({}).toArray();
    }
}

export default ListaPaciente;