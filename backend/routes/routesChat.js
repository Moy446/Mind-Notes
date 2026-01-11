import express from 'express';
import chat from '../controllers/chatController.js';

const router = express.Router();

router.get('/:idPsicologo', chat.obtenerMensajes);
router.post('/:idPsicologo', chat.enviarMensaje);