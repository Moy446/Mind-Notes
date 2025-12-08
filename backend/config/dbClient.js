import { MongoClient } from "mongodb";
import 'dotenv/config';


class dbClient{
    constructor(){
        const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.SERVER_DB}/?`;
        this.client = new MongoClient(queryString);
        this.db = null;
        this.connectClient();
    }

    async connectClient(){
        try{
            await this.client.connect();
            this.db = this.client.db(process.env.NAME_DB);
            console.log("Connected to database");
        }catch(e){
            console.error(e);
        }
    }
}

export default new dbClient;