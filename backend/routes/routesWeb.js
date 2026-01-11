import express from 'express';
import PsicologoController from '../controllers/psicologoController.js';
import pacienteController from '../controllers/pacienteController.js';

const router = express.Router();

router.get('/', PsicologoController.probarConexion);
router.post('/loginPsicologo', PsicologoController.loginPsicologo);
router.post('/loginPaciente', pacienteController.loginPaciente);
router.post('/registrarPsicologo', PsicologoController.registrarPsicologoBD);
router.post('/registrarPaciente', pacienteController.registrarPacienteBD);
router.post('/vincularPacientes/:Psicologo', PsicologoController.vincularPacientes);
router.post('/vincularPsicologo/:idPaciente', pacienteController.vincularPsicologo);



export default router;