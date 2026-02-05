import express from 'express';
import chat from '../controllers/chatController.js';
import protector from '../helpers/routesProtect.js';

const router = express.Router();

router.get('/info/:idPsicologo/:idPaciente', protector, chat.obtenerInformacionChat);
router.get('/:idPsicologo/:idPaciente', protector, chat.obtenerMensajes);

export default router;