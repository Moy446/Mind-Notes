import express from 'express';
import PsicologoController from '../controllers/psicologoController.js';

const router = express.Router();

router.get('/', PsicologoController.probarConexion);

export default router;