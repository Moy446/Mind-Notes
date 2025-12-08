import dbClient from "../config/dbclient.js";

class ListaPsicologo {
    constructor(){

    }
    async selectAll(){
        colListaPsicologo = dbClient.db.collection('listaPsicologos');
        const resultado = await colListaPsicologo.find({}).toArray();
        return resultado;
    }
}

export default ListaPsicologo;