import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import chat from '../controllers/chatController.js';
import protector from '../helpers/routesProtect.js';



const router = express.Router();

const allowedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/mp3',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'application/epub+zip',
  'application/x-mobipocket-ebook'
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/files/');
  },
  filename: function (req, file, cb) {
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.\-_]/g,
      '',
    );
    const uniqueName = Date.now() + '-' + sanitizedOriginalName;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get('/info/:idPsicologo/:idPaciente', protector, chat.obtenerInformacionChat);
router.get('/:idPsicologo/:idPaciente', protector, chat.obtenerMensajes);
router.post('/:idPsicologo/:idPaciente/archivo', protector, upload.single('file'), chat.guardarArchivo);
router.get('/:idPsicologo/:idPaciente/archivo/:archivoId', protector, chat.descargarArchivo);
router.get('/:idPsicologo/:idPaciente/archivo/:archivoId/:type', protector, chat.descargarArchivoPsi);
router.get('/:idPsicologo/:idPaciente/documento/:archivoId/:type', protector, chat.obtenerDocumento);
router.get('/:idPsicologo/:idPaciente/documento/:archivoId/texto', protector, chat.obtenerTexto);
router.delete('/:idPsicologo/:idPaciente/archivo/:archivoId', protector, chat.eliminarArchivo);
router.put('/:idPsicologo/:idPaciente/documento/:archivoId', protector, chat.guardarDocumento);

export default router;