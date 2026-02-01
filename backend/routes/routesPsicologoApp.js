import express from 'express';
import calendarController from '../controllers/calendarioController.js';

const router = express.Router();

/*calendario */
router.get('/calendario', /*Falta middleware, */calendarController.loadCalendar)
router.get('/calendario/:idCita', /*Falta middleware, */calendarController.cargarCita)
router.post('/calendario', /*Falta middleware, */calendarController.crearCita)
router.put('/calendario/:idCita', /*Falta middleware, */calendarController.editarCita)
router.delete('/calendario/:idCita', /*Falta middleware, */calendarController.eliminarCita)
//Posible ruta, ocupo ver como se armo el archivo
router.get('/calendario/ci/s', /*Falta middleware, */calendarController.obtenerNombresPacientes)

export default router;