import dbClient from "../config/dbclient.js";

class Chat {
    constructor(){

    }
    async create(datosChat){
        colChat = dbClient.db.collection('chat');
        const resultado = await colChat.insertOne(datosChat);
        return resultado;
    }
}

export default Chat;