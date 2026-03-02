import express from 'express';
import UserController from '../controllers/usuarioController.js';
import protector from '../helpers/routesProtect.js';
import chatController from '../controllers/chatController.js';
import calendarController from "../controllers/calendarioController.js";
import multer from 'multer';
import path from 'path';

const storageImages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, uniqueName);
    }
});

const imagefilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    if(allowedTypes.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Archivo no permitido, solo se permiten imágenes'));
    }   
};  

const uploadImage = multer({ storage: storageImages, fileFilter: imagefilter, limits : { fileSize: 5 * 1024 * 1024 } }); // Limite de 5MB


const router = express.Router();

//Rutas de usuario
router.get('/', UserController.probarConexion);
router.post('/login', UserController.loginUnificado); // Login unificado
// DEPRECATED: Las siguientes rutas pueden ser eliminadas, usar /login en su lugar
router.post('/loginPsicologo', UserController.loginPsicologo);
router.post('/loginPaciente', UserController.loginPaciente);
router.post('/registrarPsicologo', UserController.registrarPsicologoBD);
router.post('/registrarPaciente', UserController.registrarPacienteBD);
router.get('/me', protector, UserController.getMe);
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refresh);
router.put('/usuario/foto',protector, uploadImage.single('foto'), UserController.cambiarFotoPerfil); 
router.get('/usuario/:id', protector, UserController.obtenerPerfil);
router.post('/vincularPacientes/:idPsicologo', protector, UserController.vincularPacientes);
router.post('/vincularPsicologo/:idPaciente', protector, UserController.vincularPsicologo);
router.get('/pacientes/:idPsicologo', protector, UserController.obtenerPacientesVinculados);
router.get('/psicologos/:idPaciente', protector, UserController.obtenerPsicologosVinculados);
router.get('/mensajes/:idPsicologo/:idPaciente', protector, chatController.obtenerMensajes);
router.post('/psicologo/horario', protector, UserController.guardarHorario);
router.get('/psicologo/horario/:idUsuario', protector, UserController.obtenerHorario);

//confirmar cita
router.get('/confirmar-cita/:id', calendarController.confirmarCita);

//Rutas de autenticación
router.get('/me', protector, UserController.getMe);
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refresh);

export default router;