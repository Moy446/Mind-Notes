import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import session from 'express-session';
import passport from 'passport';
import setupPassport from './config/passport.js';
import webRoutes from './routes/routesWeb.js';
import routesChat from './routes/routesChat.js';
import routesPsicologo from './routes/routesPsicologoApp.js';
import routesPaciente from './routes/routesPaciente.js';
import routesAuth from './routes/routesAuth.js';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import multer from 'multer';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatSocket from './sockets/chatSocket.js';
import dbClient from './config/dbClient.js';
import cookieCtrl from './helpers/cookiesControll.js';
import paymentController from './controllers/paymentController.js';
import enviarNotificaciones from './jobs/notificaciones.js';
import { ins } from 'framer-motion/client';
import fs from 'fs';
import path from 'path';


const app = express();
const PORT = process.env.PORT || 5000;


async function startServer() {
    await dbClient.connect();

    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_URL, 'http://localhost:3001', 'http://localhost:5173'],
            credentials: true
        }
    });
    app.set('io', io);

    // Cors
    app.use(cors({
        origin: [process.env.FRONTEND_URL, 'http://localhost:3001', 'http://localhost:5173'],
        credentials: true
    }));

    app.post(
        '/api/psicologo/webhook/stripe',
        express.raw({ type: 'application/json' }),
        paymentController.confirmarPago
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    const sessionSecret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
    if (!sessionSecret) {
        throw new Error('SESSION_SECRET is required for express-session');
    }

    // Configurar sesión para Passport (SOLO UNA VEZ)
    // Configurar sesion para Passport
    app.use(session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.STAGE === 'production',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        }
    }));

    // Inicializar Passport (SOLO UNA VEZ)
    setupPassport(passport);
    app.use(passport.initialize());
    app.use((req, res, next) => {
        const originalLogin = req.login?.bind(req) || req.logIn?.bind(req);
        if (originalLogin) {
            req.login = req.logIn = (user, options, done) => {
                if (typeof options === 'function') {
                    done = options;
                    options = {};
                }
                const safeOptions = { ...(options || {}), session: false };
                return originalLogin(user, safeOptions, done);
            };
        }
        next();
    });

    //verficar las carpetas de uploads

    const folders = [
    'uploads/files',
    'uploads/audio',
    'uploads/images',
    'uploads/docs'
    ];

    folders.forEach(folder => {
    const fullPath = path.join('./', folder);

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Carpeta creada: ${fullPath}`);
    } else {
        console.log(`Ya existe: ${fullPath}`);
    }
    });

    // app.use(csrf({ cookie: true })); // Descomenta si necesitas CSRF

    // Iniciar el job de notificaciones
    enviarNotificaciones();

    // Routes
    app.use('/api', webRoutes);
    app.use('/api/chat', routesChat);
    app.use('/api/psicologo', routesPsicologo);
    app.use('/api/paciente',routesPaciente)
    app.use('/api/auth', routesAuth);
    app.use('/uploads', express.static('uploads'));

    // Inicializar Socket.IO
    chatSocket(io);

    app.use((err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'El archivo es demasiado grande. El tamaño máximo es 5MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: `Error al subir archivo: ${err.message}`
            });
        }
        next(err);
    });


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
        console.log(`🚀 Servidor ejecutándose ${PORT}`);
    });
}

startServer().catch(console.error);
