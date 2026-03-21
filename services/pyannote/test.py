from pyannote.audio import Pipeline
import os
from dotenv import load_dotenv
import torch

load_dotenv(dotenv_path=".env")

file = "test.mp3"

pipeline = Pipeline.from_pretrained(
  "pyannote/speaker-diarization-3.1",
  use_auth_token=os.getenv("HF_TOKEN")
)


diarizacion = pipeline(file)

results = []
for turn, _, speaker in diarizacion.itertracks(yield_label=True):
    results.append({
        "start": turn.start,
        "end": turn.end,
        "speaker": speaker
    })

print({"diarization": results})