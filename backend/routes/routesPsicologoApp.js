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
//configuracion multer
const allowedMediaTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg','audio/webm','audio/mp3'];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null,'uploads/audio/')
    },
    filename: function (req, file, cb) {
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const uniqueName = Date.now() + '-' + sanitizedOriginalName;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedMediaTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get('/grabacion', /*Falta middleware, */grabacionController.loadPacientes)
router.post('/grabacion', /*Falta middleware, */upload.single('audio'),grabacionController.guardarGrabacion)
export default router;