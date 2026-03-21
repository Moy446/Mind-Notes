import express from "express";
import multer from "multer";
import calendarController from "../controllers/calendarioController.js";
import grabacionController from "../controllers/grabacionController.js";
import paymentController from "../controllers/paymentController.js";
import chatController from "../controllers/chatController.js";
import protector from "../helpers/routesProtect.js";
import htmlToDocx from "html-to-docx";

const router = express.Router();


/*calendario psicologo*/
router.get("/calendario", protector, calendarController.loadCalendar);
router.get("/calendario/:idCita", protector, calendarController.cargarCita);
router.post("/calendario", protector, calendarController.crearCita);
router.put("/calendario/:idCita", protector, calendarController.editarCita);
router.delete("/calendario/:idCita", protector, calendarController.eliminarCita);
router.get("/calendario/pacientes/lista", protector, calendarController.cargarUsuarios);

/*grabacion */
//configuracion multer
const allowedMediaTypes = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp3",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/audio/");
  },
  filename: function (req, file, cb) {
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.\-_]/g,
      "",
    );
    const fechaActual = new Date().toLocaleDateString('sv');
    const uniqueName = fechaActual + "-" + sanitizedOriginalName;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedMediaTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/grabacion", protector, grabacionController.loadPacientes);
router.post("/grabacion",protector,upload.single("audio"),grabacionController.guardarGrabacion);

/*Documentos*/
router.post("/export-docx", async (req, res) => {
  try {
    console.log("POST /export-docx");

    const { html } = req.body;
    if (!html) {
      return res.status(400).send("HTML vacío");
    }

    const buffer = await htmlToDocx(html);

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=documento.docx",
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generando DOCX");
  }
});
// Pagos (Stripe)
router.post("/checkout", protector, paymentController.sesionPago);
router.post("/checkout/confirm-session", protector, paymentController.confirmarSesionCheckout);
router.post("/suscripcion/:idUsuario", protector, paymentController.obtenerSuscripcion);
router.post("/cancel-subscription", protector, paymentController.cancelarSuscripcion);

export default router;