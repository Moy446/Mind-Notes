import express from 'express';
import chat from '../controllers/chatController.js';
import protector from '../helpers/routesProtect.js';

const router = express.Router();

router.get('/:idUser',protector, chat.obtenerMensajes);
router.post('/:idUser',protector, chat.enviarMensaje);
router.get('/info/:idPsicologo/:idPaciente', protector, chat.obtenerInformacionChat);


export default router;