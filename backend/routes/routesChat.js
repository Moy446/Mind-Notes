import express from 'express';
import chat from '../controllers/chatController.js';
import protector from '../helpers/routesProtect.js';

const router = express.Router();

router.get('/:idUser',protector, chat.obtenerMensajes);
router.post('/:idUser',protector, chat.enviarMensaje);


export default router;