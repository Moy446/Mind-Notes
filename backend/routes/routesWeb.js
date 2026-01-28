import express from 'express';
import UserController from '../controllers/usuarioController.js';
import protector from '../helpers/routesProtect.js';
import chatController from '../controllers/chatController.js';

const router = express.Router();

router.get('/', UserController.probarConexion);
router.post('/loginPsicologo', UserController.loginPsicologo);
router.post('/loginPaciente', UserController.loginPaciente);
router.post('/registrarPsicologo', UserController.registrarPsicologoBD);
router.post('/registrarPaciente', UserController.registrarPacienteBD);
router.get('/me', protector, UserController.getMe);
router.post('/logout', UserController.logout);
router.post('/refresh', UserController.refresh);
router.post('/vincularPacientes/:Psicologo', protector, UserController.vincularPacientes);
router.post('/vincularPsicologo/:idPaciente', protector, UserController.vincularPsicologo);
router.get('/pacientes/:idPsicologo', protector, UserController.obtenerPacientesVinculados);
router.get('/psicologos/:idPaciente', protector, UserController.obtenerPsicologosVinculados);
router.get('/mensajes/:idPsicologo/:idPaciente', protector, chatController.obtenerMensajes);

export default router;