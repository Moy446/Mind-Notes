import whisper
from fastapi import FastAPI, File, UploadFile
import uvicorn
import tempfile
import os


model = whisper.load_model("base")
app = FastAPI()

@app.post("/transcribe")
# falta instaciar si se borra el archvio temporal o no
async def trancribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        path = tmp.name
    result = model.transcribe(path, language="es")
    os.remove(path)

    return {
        "text": result["text"]    
    }
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9001)
