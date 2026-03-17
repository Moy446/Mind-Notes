import ListaVinculacion from "../models/ListaVinculacion.js";
import Chat from "../models/Chat.js";
import consumeAI from "../helpers/consumeAI.js";
import fs from "fs";
import emailService from "../helpers/emailService.js";
import path from "path";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { fileURLToPath } from 'url';

class GrabacionController {
    constructor() {
    }

    async loadPacientes(req, res) {

        const idPsicologo = req.user.idUsuario;

        try {
            const listaVinculacion = new ListaVinculacion();
            const nombresPacientes = await listaVinculacion.findByPsicologo(idPsicologo);
            res.status(200).json({ success: true, nombresPacientes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al cargar la lista de pacientes' });
        }
    }

    async guardarGrabacion(req, res) {
        const { idPaciente, nombrePaciente, resume, grabacion } = req.body;
        const idPsicologo = req.user.idUsuario;
        try {
            //archivo de prueba
            //const filePath = "uploads/audio/test.mp3";
            //const docPath = "uploads/docs/recetas.docx";
            //const diarization = await consumeAI.diarize(req.file.path /*filePath*/);
            const text = await consumeAI.transcribe(req.file.path /*filePath*/);
            const summaClassi = await consumeAI.classify(text.data.transcription);
            const { VIDA_LABORAL: vidaLaboral, VIDA_PERSONAL: vidaPersonal, VIDA_AMOROSA: vidaAmorosa, VIDA_FAMILIAR: vidaFamiliar, resumen } = summaClassi.clasificacion;
            console.log(vidaLaboral, vidaPersonal, vidaAmorosa, vidaFamiliar, resumen);

            //Enviar datos para la elaboracion del archivo
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const doc = new Document({
                sections: [{
                    children: [
                        new Paragraph({ children: [new TextRun("Resumen")] }),
                        new Paragraph({ children: [new TextRun(resumen)] }),
                        new Paragraph({ children: [new TextRun("")] }), // Espacio

                        new Paragraph({ children: [new TextRun("Vida laboral")] }),
                        new Paragraph({ children: [new TextRun(vidaLaboral + "")] }),
                        new Paragraph({ children: [new TextRun("")] }),

                        new Paragraph({ children: [new TextRun("Vida personal")] }),
                        new Paragraph({ children: [new TextRun(vidaPersonal + "")] }),
                        new Paragraph({ children: [new TextRun("")] }),

                        new Paragraph({ children: [new TextRun("Vida amorosa")] }),
                        new Paragraph({ children: [new TextRun(vidaAmorosa + "")] }),
                        new Paragraph({ children: [new TextRun("")] }),

                        new Paragraph({ children: [new TextRun("Vida familiar")] }),
                        new Paragraph({ children: [new TextRun(vidaFamiliar + "")] })
                    ]
                }]
            });

            const buffer = await Packer.toBuffer(doc);

            const nombreArchivo = new Date().toLocaleDateString('sv');
            const rutaGuardado = path.join(__dirname, '..', 'uploads', 'docs', idPsicologo + "", idPaciente + "", nombreArchivo + ".doc");
            const rutaGrabacion = path.join(__dirname, '..', 'uploads', 'audio', idPsicologo + "", idPaciente + "", nombreArchivo + ".wav");

            const dir = path.dirname(rutaGuardado);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const dirGra = path.dirname(rutaGrabacion);
            if (!fs.existsSync(dirGra)) {
                fs.mkdirSync(dirGra, { recursive: true });
            }

            // Guardar el archivo
            fs.writeFileSync(rutaGuardado, buffer);
            fs.renameSync(req.file.path, rutaGrabacion);

            //subir archivo a la base de datos
            const chat = new Chat();
            const resultadoExpediente = await chat.insertExpediente(idPsicologo, idPaciente, rutaGuardado);
            if (resultadoExpediente.modifiedCount !== 1) {
                return res.status(500).json({ success: false, message: 'Error al guardar el archivo' });
            }
            if (grabacion) {
                const resultadoGrabacion = await chat.insertGrabacion(idPsicologo, idPaciente, rutaGrabacion);
                if (resultadoGrabacion.modifiedCount !== 1) {
                    return res.status(500).json({ success: false, message: 'Error al guardar la grabación' });
                }
            } else {
                const filePath = path.resolve(req.file.path);
                fs.unlinkSync(rutaGrabacion);
            }

            //enviar correo al psicologo notificando que el expediente esta listo
            const { nombre, email: emailPsicologo } = req.user;
            await emailService.enviarInforme(emailPsicologo, nombre, rutaGuardado);
            res.status(200).json({ success: true, message: 'Grabación guardada correctamente' });
        } catch (error) {
            console.log("Error al procesar la grabación:", error);
            return res.status(500).json({ success: false, message: 'Error al procesar la grabación' });
        }

    }
}

export default new GrabacionController();