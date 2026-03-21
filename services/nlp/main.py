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
    "token-classification",
    model="./trainingModel/bert-ner",
    tokenizer="./trainingModel/bert-ner",
    aggregation_strategy="simple"
)

app = FastAPI()
@app.post("/summarize")
async def summarize(input: textInput.TextInput):
    prompt = f"""Resume el texto en un párrafo muy corto tipo TL;DR: 
    {input.text}"""

    result = summarizer(
        prompt,
        max_new_tokens=1000,     
        min_new_tokens=300,     
        do_sample=False,
        num_beams=4,            
        length_penalty=1.2      
    )

    return {
        "summary": result[0]["generated_text"]
    }

def merge_tokens(tokens):
    words = []
    for token in tokens:
        if token.startswith("##") and len(words) > 0:
            words[-1] += token[2:]
        else:
            words.append(token)
    return " ".join(words)

@app.post("/classify")
async def classify(input: textInput.TextInput):
    result = classifier(input.text)
    
    laboral_tokens = [r["word"] for r in result if r["entity_group"] == "TRABAJO"]
    amorosa_tokens = [r["word"] for r in result if r["entity_group"] == "AMOROSA"]
    personal_tokens = [r["word"] for r in result if r["entity_group"] == "PERSONAL"]
    familiar_tokens = [r["word"] for r in result if r["entity_group"] == "FAMILIAR"]

    return {
        "laboral": merge_tokens(laboral_tokens),
        "amorosa": merge_tokens(amorosa_tokens),
        "personal": merge_tokens(personal_tokens),
        "familiar": merge_tokens(familiar_tokens)
    }

if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv("IP"), port=int(os.getenv("PORT")))

