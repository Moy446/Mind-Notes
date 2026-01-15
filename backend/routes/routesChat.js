import express from 'express';
import chat from '../controllers/chatController.js';
import protector from '../helpers/routesProtect.js';

const router = express.Router();

router.get('/:idPsicologo', protector, chat.obtenerMensajes);
router.post('/:idPsicologo', protector, chat.enviarMensaje);

export default router;