import express from 'express';
import PsicologoController from '../controllers/psicologoController.js';
import pacienteController from '../controllers/pacienteController.js';
import protector from '../helpers/routesProtect.js';

const router = express.Router();

router.get('/', PsicologoController.probarConexion);
router.post('/loginPsicologo', PsicologoController.loginPsicologo);
router.post('/loginPaciente', pacienteController.loginPaciente);
router.post('/registrarPsicologo', PsicologoController.registrarPsicologoBD);
router.post('/registrarPaciente', pacienteController.registrarPacienteBD);
router.post('/vincularPacientes/:Psicologo', protector, PsicologoController.vincularPacientes);
router.post('/vincularPsicologo/:idPaciente', protector, pacienteController.vincularPsicologo);

export default router;