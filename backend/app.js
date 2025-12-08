import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import webRoutes  from './routes/web.js';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

const app = express();
const PORT = process.env.PORT || 5000;

//Cors
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3001'], // URLs del frontend React
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.use(csrf({cookie:true}));

//Routes
app.use('/', webRoutes);

//Listener
try{
    app.listen(PORT, ()=>{
        console.log(`El servidor esta funcionando en el puerto ${PORT}`);
    });   
}catch(e){
    console.error(e);
}