import { MongoClient } from "mongodb";
import 'dotenv/config';

class dbClient {
    constructor() {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        this.client = new MongoClient(process.env.MONGO_URI);
        this.db = this.client.db(process.env.NAME_DB);
    }

    async connect() {
        try {
            await this.client.connect();
            console.log("Connected to database");
        } catch (e) {
            console.error("Database connection failed:", e);
            throw e;
        }
    }
}

export default new dbClient();