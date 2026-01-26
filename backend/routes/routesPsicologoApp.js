import express from 'express';
import multer from 'multer';
import calendarController from '../controllers/calendarioController.js';
import grabacionController from '../controllers/grabacionController.js';

const router = express.Router();

/*calendario */
router.get('/calendario', /*Falta middleware, */calendarController.loadCalendar)
router.get('/calendario/:idCita', /*Falta middleware, */calendarController.cargarCita)
router.post('/calendario', /*Falta middleware, */calendarController.crearCita)
router.put('/calendario/:idCita', /*Falta middleware, */calendarController.editarCita)
router.delete('/calendario/:idCita', /*Falta middleware, */calendarController.eliminarCita)
router.get('/calendario/pacientes/lista', /*Falta middleware, */calendarController.cargarPacientes)

/*grabacion */
const upload = multer({ dest: 'uploads/audio/' });

router.get('/grabacion', /*Falta middleware, */grabacionController.loadPacientes)
router.post('/grabacion', /*Falta middleware, */upload.single('audio'),grabacionController.guardarGrabacion)
export default router;