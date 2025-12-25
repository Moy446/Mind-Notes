import axios from 'axios';
import fs from 'fs';

class ConsumeAI {
    constructor() {
    }
    async transcribe(audio){
        const form = new FormData();
        form.append("audio",fs.createReadStream(audio.path))
        try{
            const response = await axios.post(
                process.env.TRANSCRIPTION_SERVICE_URL,
                form,
                { headers: form.getHeaders()}
            );
            res.json(response.data);
        }catch(e){
            console.log(e);
        }
    }

    async diarize(audio){
        try{
            const form = new FormData();
            form.append("audio",fs.createReadStream(audio.path))
            const response = await axios.post(
                process.env.DIARIZATION_SERVICE_URL,
                form,
                { headers: form.getHeaders() }
            );
            res.json(response.data);
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
            res.json(response.data);
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
            res.json(response.data);
        }catch(e){
            console.log(e);
        }
    }
}

export default new ConsumeAI();