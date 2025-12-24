from fastapi import FastAPI, File, UploadFile
from dotenv import load_dotenv
import tempfile
import os 
import uvicorn
import torch
from pyannote.audio import Pipeline

app = FastAPI()
load_dotenv(dotenv_path=".env")
pipeline = Pipeline.from_pretrained(
  "pyannote/speaker-diarization-3.1",
  use_auth_token=os.getenv("HF_TOKEN"))


@app.post("/diarize")
async def diarize(file: UploadFile = File(...)):
    pass
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(await file.read())
        temp_audio_path = temp_audio.name

    diarization = pipeline(temp_audio_path)

    results = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        results.append({
            "start": turn.start,
            "end": turn.end,
            "speaker": speaker
        })

    os.remove(temp_audio_path)
    return {"diarization": results}

if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv("IP"), port=int(os.getenv("PORT")))

