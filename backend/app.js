import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import webRoutes from './routes/routesWeb.js';
import routesChat from './routes/routesChat.js';
import routesPsicologo from './routes/routesPsicologoApp.js';
import routesAuth from './routes/routesAuth.js';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatSocket from './sockets/chatSocket.js';
import dbClient from './config/dbClient.js';
import bodyParser from 'body-parser';
import cookieCtrl from './helpers/cookiesControll.js';


const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cookieParser())


async function startServer() {
    await dbClient.connect();

    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_URL, 'http://localhost:3001', 'http://localhost:5173'],
            credentials: true
        }
    });

    // Cors
    app.use(cors({
        origin: [process.env.FRONTEND_URL, 'http://localhost:3001', 'http://localhost:5173'],
        credentials: true
    }));
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());
    // app.use(csrf({ cookie: true })); // Descomenta si necesitas CSRF



    // Routes
    app.use('/api', webRoutes);
    app.use('/api/chat', routesChat);
    app.use('/api/psicologo', routesPsicologo);
    app.use('/api/auth', routesAuth);

    // Inicializar Socket.IO
    chatSocket(io);

    // Manejo de errores
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    });

    // Ruta para manejar 404
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Ruta no encontrada'
        });
    });

    // Listener
    server.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);