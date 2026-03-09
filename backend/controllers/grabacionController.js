import ListaVinculacion from "../models/ListaVinculacion.js";
import Chat from "../models/Chat.js";
import consumeAI from "../helpers/consumeAI.js";
import fs from "fs";
import emailService from "../helpers/emailService.js";
import path from "path";
import { Document, Packer, Paragraph, TextRun } from "docx";
import FileSaver from "file-saver";

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
            const filePath = "uploads/audio/test.mp3";
            const docPath = "uploads/docs/recetas.docx";
            //const diarization = await consumeAI.diarize(/*req.file.path*/ filePath);
            const text = await consumeAI.transcribe(/*req.file.path*/ filePath);
            const summaClassi = await consumeAI.classify(text.data.transcription);
            const { VIDA_LABORAL: vidaLaboral, VIDA_PERSONAL: vidaPersonal, VIDA_AMOROSA: vidaAmorosa, VIDA_FAMILIAR: vidaFamiliar, resumen } = summaClassi.clasificacion;
            console.log(vidaLaboral, vidaPersonal, vidaAmorosa, vidaFamiliar, resumen);

            //Enviar datos para la elaboracion del archivo
            console.log(vidaLaboral);
            console.log(vidaPersonal);
            console.log(vidaAmorosa);
            console.log(vidaFamiliar);
            console.log(resumen);
            console.log(text);

            const doc = new Document({
                sections: [{
                    children: [
                        new Paragraph({
                            children: [new TextRun(text)],
                        }),
                    ],
                }],
            });

            Packer.toBlob(doc).then((blob) => {
                FileSaver.saveAs(blob, "ejemplo.docx");
            });

            //subir archivo a la base de datos
            const chat = new Chat();
            const resultadoExpediente = await chat.insertExpediente(idPsicologo, idPaciente, docPath);
            if (resultadoExpediente.modifiedCount !== 1) {
                return res.status(500).json({ success: false, message: 'Error al guardar el archivo' });
            }
            if (grabacion) {
                const resultadoGrabacion = await chat.insertGrabacion(idPsicologo, idPaciente, filePath);
                if (resultadoGrabacion.modifiedCount !== 1) {
                    return res.status(500).json({ success: false, message: 'Error al guardar la grabación' });
                }
            } else {
                const filePath = path.resolve(req.file.path);
                fs.unlinkSync(filePath);
            }

            //enviar correo al psicologo notificando que el expediente esta listo
            const { nombre, email: emailPsicologo } = req.user;
            await emailService.enviarInforme(emailPsicologo, nombre, docPath);
            res.status(200).json({ success: true, message: 'Grabación guardada correctamente' });
        } catch (error) {
            console.log("Error al procesar la grabación:", error);
            return res.status(500).json({ success: false, message: 'Error al procesar la grabación' });
        }

    }
}

export default new GrabacionController();