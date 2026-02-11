import json
from fastapi.concurrency import run_in_threadpool
import whisper
from fastapi import FastAPI, File, Form, UploadFile
import uvicorn
from dotenv import load_dotenv
import tempfile
import os
from pydub import AudioSegment


model = whisper.load_model("base")
app = FastAPI()
load_dotenv(dotenv_path=".env")


@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await audio.read())
        path = tmp.name
    try:        
        result = model.transcribe(path, language="es", fp16=False)
    except Exception as e:
        return {"error": str(e)}
    finally:
        os.remove(path)

    return {"transcription": result["text"]}

@app.post("/transcribe-diarize")
async def transcribeDiarize(audio: UploadFile = File(...), diarizationData:str = Form(...)):

    diarizationData = json.loads(diarizationData)
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await audio.read())
        path = tmp.name
    results=[]
    try:
        segment = AudioSegment.from_file(path)
        for _, seg in enumerate(diarizationData):
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                segmentPath = tmp.name
            segment[seg["start"]*1000:seg["end"]*1000].export(segmentPath, format="wav")
            try:
                result = await run_in_threadpool(model.transcribe, segmentPath, language="es", fp16=False)
                results.append(f"{seg['speaker']}:{result['text']}")
            except Exception as e:
                return {"error": str(e)}
                
            finally:
                os.remove(segmentPath)
    except Exception as e:
        return {"error": str(e)}
    
    finally:
        os.remove(path)

    return {"transcription": " ".join(results)}


if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv("IP"), port=int(os.getenv("PORT")))
    