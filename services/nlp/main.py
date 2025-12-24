from fastapi import FastAPI
from transformers import pipeline
import uvicorn
import textInput
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")

summarizer = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

classifier = pipeline(
    "text-classification",
    model="bert-base-multilingual-cased"
)

app = FastAPI()
@app.post("/summarize")
async def summarize(input: textInput.TextInput):
    prompt = f"""Resume el texto en un párrafo muy corto tipo TL;DR: 
    {input.text}"""

    result = summarizer(
        prompt,
        max_length=300,
        do_sample=False
    )

    return {
        "summary": result[0]["generated_text"]
    }

@app.post("/classify")
async def classify(input: textInput.TextInput):
    result = classifier(input.text)

    return {
        "label": result[0]["label"],
        "confidence": round(result[0]["score"], 3)
    }

if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv("IP"), port=int(os.getenv("PORT")))

