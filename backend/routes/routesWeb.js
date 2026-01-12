import express from 'express';
import PsicologoController from '../controllers/psicologoController.js';
import pacienteController from '../controllers/pacienteController.js';
import routesProtect from '../helpers/routesProtect.js';

const router = express.Router();

router.get('/',  PsicologoController.probarConexion);
router.post('/loginPsicologo', PsicologoController.loginPsicologo);
router.post('/loginPaciente', pacienteController.loginPaciente);
router.post('/registrarPsicologo',routesProtect.protector, PsicologoController.registrarPsicologoBD);
router.post('/registrarPaciente',routesProtect.protector, pacienteController.registrarPacienteBD);
router.post('/vincularPacientes/:Psicologo',routesProtect.protector, PsicologoController.vincularPacientes);
router.post('/vincularPsicologo/:idPaciente',routesProtect.protector, pacienteController.vincularPsicologo);



export default router;