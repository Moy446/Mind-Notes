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
            return response.data;
        }catch(e){
            console.log(e);
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
            return response.data;
        }catch(e){
            console.log(e);
        }
    }

    async sumarize(text){
        try{
            const response = await axios.post(
                process.env.SUMMARIZATION_SERVICE_URL,
                { text: text }
            )
            return response.data;
        }catch(e){
            console.log(e);
        }
    }

    async classify(text){
        try{
            const response = await axios.post(
                process.env.CLASSIFICATION_SERVICE_URL,
                { text: text }
            )
            return response.data;
        }catch(e){
            console.log(e);
        }
    }
}

export default new ConsumeAI();