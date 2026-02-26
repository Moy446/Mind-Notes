import express from 'express';
import UserController from '../controllers/usuarioController.js';
import protector from '../helpers/routesProtect.js';
import chatController from '../controllers/chatController.js';
import calendarController from "../controllers/calendarioController.js";

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
router.put('/usuario/:id', protector, UserController.actualizarPerfil);
router.get('/usuario/:id', protector, UserController.obtenerPerfil);
router.post('/vincularPacientes/:idPsicologo', protector, UserController.vincularPacientes);
router.post('/vincularPsicologo/:idPaciente', protector, UserController.vincularPsicologo);
router.get('/pacientes/:idPsicologo', protector, UserController.obtenerPacientesVinculados);
router.get('/psicologos/:idPaciente', protector, UserController.obtenerPsicologosVinculados);
router.get('/mensajes/:idPsicologo/:idPaciente', protector, chatController.obtenerMensajes);

//confirmar cita
router.get('/confirmar-cita/:id', calendarController.confirmarCita);

//Rutas de autenticación
router.get('/me', protector, UserController.getMe);
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refresh);

export default router;