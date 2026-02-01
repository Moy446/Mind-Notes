import whisper

file = "test.mp3"

model = whisper.load_model("base")
result = model.transcribe(file, language="es", fp16=False)

print(result["text"])