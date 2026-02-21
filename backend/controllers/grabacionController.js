import ListaVinculacion from "../models/ListaVinculacion.js";
import Chat from "../models/Chat.js";
import consumeAI from "../helpers/consumeAI.js";
import fs from "fs";

class GrabacionController {
    constructor() {
    }

    async loadPacientes(req, res) {
        
        const idPsicologo = req.user.idUsuario;

        try {
            const listaVinculacion = new ListaVinculacion();
            const nombresPacientes = await listaVinculacion.findByPsicologo(idPsicologo);
            res.status(200).json({success:true, nombresPacientes});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al cargar la lista de pacientes'});    
        }
    }

    async guardarGrabacion(req, res ,next) {
        const {idPaciente, nombrePaciente, resume, grabacion} = req.body;
        const idPsicologo = req.user.idUsuario;

        try {
            //archivo de prueba
            const filePath = "uploads/audio/test.mp3";
            const docPath = "uploads/docs/recetas.docx";

            //const diarization = await consumeAI.diarize(/*req.file.path*/ filePath);
            const text = await consumeAI.transcribe(/*req.file.path*/ filePath);
            const summaClassi = await consumeAI.classify(text.data.transcription);
            const {VIDA_LABORAL: vidaLaboral, VIDA_PERSONAL: vidaPersonal, VIDA_AMOROSA: vidaAmorosa, VIDA_FAMILIAR: vidaFamiliar, resumen} = summaClassi.clasificacion;
            //Enviar datos para la elaboracion del archivo
                
            //subir archivo a la base de datos
            const chat = new Chat();
            const resultadoExpediente = await chat.insertExpediente(idPsicologo, idPaciente, docPath);
            if(grabacion){
                const resultadoGrabacion = await chat.insertGrabacion(idPsicologo, idPaciente, filePath);
                if (resultadoExpediente.modifiedCount === 1 && resultadoGrabacion.modifiedCount === 1) {
                    //Enviar notificacion por correo
                    res.status(200).json({ success: true, message: 'Grabación guardada correctamente' });
                    next();
                }else{
                    res.status(500).json({ success: false, message: 'Error al guardar la grabación' });
                    next();
                }
            }
            if (resultadoExpediente.modifiedCount === 1) {
                fs.unlinkSync(req.file.path);
                //Enviar notificacion por correo
                res.status(200).json({ success: true, message: 'Grabación guardada correctamente' });
                next();
            }else{
                res.status(500).json({ success: false, message: 'Error al guardar  grabación' });
                next();
            }
        } catch (error) {
            console.log("Error al procesar la grabación:", error);
            res.status(500).json({ success: false, message: 'Error al procesar la grabación' });
        }
        
    }
}

export default new GrabacionController();