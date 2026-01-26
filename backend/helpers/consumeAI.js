import axios from 'axios';
import fs from 'fs';

class ConsumeAI {
    constructor() {
    }
    async transcribe(audioPath){
        const form = new FormData();
        form.append("audio",fs.createReadStream(audioPath))
        try{
            const response = await axios.post(
                process.env.TRANSCRIPTION_SERVICE_URL,
                form,
                { headers: form.getHeaders()}
            );
            return {status : 200, data: response.data};
        }catch(e){

            return {status: 500, message: "Hubo un error en la transcripcion"};
        }
    }

    async diarize(audioPath){
        try{
            const form = new FormData();
            form.append("audio",fs.createReadStream(audioPath))
            const response = await axios.post(
                process.env.DIARIZATION_SERVICE_URL,
                form,
                { headers: form.getHeaders() }
            );
            return {status : 200, data: response.data};
        }catch(e){
            return {status: 500, message: "Hubo un error en la diarizacion"};
        }
    }

    async sumarize(text){
        try{
            const response = await axios.post(
                process.env.SUMMARIZATION_SERVICE_URL,
                { text: text }
            )
            return {status : 200, data: response.data};
        }catch(e){
            return {status: 500, message: "Hubo un error en la elaboracion del resumen"};
        }
    }

    async classify(text){
        try{
            const response = await axios.post(
                process.env.CLASSIFICATION_SERVICE_URL,
                { text: text }
            )
            return {status : 200, data: response.data};
        }catch(e){
            return {status: 500, message: "Hubo un error en la clasificacion"};
        }
    }
}

export default new ConsumeAI();