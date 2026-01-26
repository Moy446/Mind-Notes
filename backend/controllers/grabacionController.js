import ListaPaciente from "../models/ListaPaciente.js";
import chat from "../models/Chat.js";
import consumeAI from "../helpers/consumeAI.js";
import fs from "fs";

class GrabacionController {
    constructor() {
    }

    async loadPacientes(req, res) {
        //borrar
        const idPsicologo = "694b01541fb1a9eadec23c53";
        //
        try {
            const listaPacientes = new ListaPaciente();
            const nombresPacientes = await listaPacientes.findPacienteByIdPsicologo(idPsicologo);
            res.status(200).json({success:true, nombresPacientes});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al cargar la lista de pacientes'});    
        }
    }

    async guardarGrabacion(req, res) {
        res.status(200).json({ success: true, message: 'Grabación guardada correctamente' });
        const {idPsicologo, nombrePaciente, resume, grabacion} = req.body;
        try {
            const text = await consumeAI.transcribe(req.file.path);
            const diarization = await consumeAI.diarize(req.file.path); 
            if (resume) {
                const resumen = await consumeAI.sumarize(text);
            }
            const classification = await consumeAI.classify(text);
            if (text && diarization && classification) {
                if (!grabacion){
                    fs.unlinkSync(req.file.path);
                }
                //Enviar datos para la elaboracion del archivo
                
                //subir archivo a la base de datos
                
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al procesar la grabación' });
        }
        
    }
}

export default new GrabacionController;