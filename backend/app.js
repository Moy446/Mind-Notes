import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

//Cors
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // URLs del frontend React

}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.use(csrf({cookie:true}));
