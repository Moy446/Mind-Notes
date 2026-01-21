import express from 'express';
import calendarController from '../controllers/calendarioController.js';

const router = express.Router();

/*calendario */
router.get('/calendario', /*Falta middleware, */calendarController.loadCalendar)
router.post('/calendario/crear-cita', /*Falta middleware, */calendarController.crearCita)
router.put('/calendario/editar-cita', /*Falta middleware, */calendarController.editarCita)
router.delete('/calendario/eliminar-cita', /*Falta middleware, */calendarController.eliminarCita)

export default router;