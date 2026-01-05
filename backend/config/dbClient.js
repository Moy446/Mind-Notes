import { MongoClient } from "mongodb";
import 'dotenv/config';


class dbClient{
    constructor(){
        if(!process.env.MONGO_URI){
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        this.client = new MongoClient(process.env.MONGO_URI);
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