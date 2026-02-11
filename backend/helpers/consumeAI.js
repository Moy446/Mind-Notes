import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import OpenAI from "openai";
import dotenv from "dotenv";
import { th } from "framer-motion/client";
import { type } from "os";

class ConsumeAI {
  constructor() {
  }

  async transcribe(audioPath, diarizationData) {
    const form = new FormData();
    form.append("audio", fs.createReadStream(audioPath));
    form.append("diarizationData", JSON.stringify(diarizationData));
    try {
      const response = await axios.post(
        process.env.TRANSCRIPTION_SERVICE_URL,
        form,
        { headers: form.getHeaders() },
      );
      return { status: 200, data: response.data };
    } catch (e) {
      throw new Error(`Hubo un error en la transcripcion ${e}`);
    }
  }

  async diarize(audioPath) {
    const form = new FormData();
    form.append("audio", fs.createReadStream(audioPath));
    try {
      const response = await axios.post(
        process.env.DIARIZATION_SERVICE_URL,
        form,
        { headers: form.getHeaders() },
      );
      return { status: 200, data: response.data };
    } catch (e) {
      throw new Error(`Hubo un error en la diarizacion ${e}`);
    }
  }

  async classify(escrito) {
    dotenv.config();
    const client = new OpenAI({
      apiKey: process.env.AI_TOKEN,
    });
    const MODEL = "gpt-4.1-mini"; // o gpt-4o
    try {
      const response = await client.responses.create({
        model: MODEL,
        text: {
          format:{
            type: "json_schema",
            name: "clasificacion",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                VIDA_LABORAL: { type: "array", items: { type: "string" } },
                VIDA_PERSONAL: { type: "array", items: { type: "string" } },
                VIDA_AMOROSA: { type: "array", items: { type: "string" } },
                VIDA_FAMILIAR: { type: "array", items: { type: "string" } },
                resumen: { type: "string" }
              },
               required: [
                "VIDA_LABORAL",
                "VIDA_PERSONAL",
                "VIDA_AMOROSA",
                "VIDA_FAMILIAR",
                "resumen"
              ]
            }
          }
        },
        input: [{
            role: "system",
            content: `
              Eres un psicólogo especializado en análisis narrativo y evaluación psicosocial.

              Tu tarea es ANALIZAR el texto proporcionado y CLASIFICAR fragmentos textuales
              en las siguientes dimensiones de vida:

              - VIDA_LABORAL
              - VIDA_PERSONAL
              - VIDA_AMOROSA
              - VIDA_FAMILIAR

              DEFINICIONES:
              - VIDA_LABORAL: trabajo, empleo, carrera, estudios, ambiente laboral,
                búsqueda de empleo, motivación profesional, jefes, compañeros, desempeño.
              - VIDA_PERSONAL: emociones, pensamientos, autoestima, motivaciones,
                frustraciones, toma de decisiones, crecimiento personal.
              - VIDA_AMOROSA: pareja, relaciones sentimentales, rupturas, matrimonio,
                apoyo o conflicto con la pareja.
              - VIDA_FAMILIAR: familia, padres, hijos, hermanos, crianza,
                apoyo o conflicto familiar.

              REGLAS ESTRICTAS (OBLIGATORIAS):
              1. Usa SOLO fragmentos que EXISTAN literalmente en el texto.
              2. NO corrijas errores gramaticales ni reformules.
              3. Cada elemento del array debe ser UNA FRASE CORTA o fragmento breve.
              4. NO incluyas saltos de línea dentro de los strings.
              5. NO incluyas comillas sin escapar.
              6. Si una frase pertenece a varias categorías, repítela.
              7. Si una categoría no aplica, devuelve un array vacío [].
              8. NUNCA incluyas texto fuera del JSON.
              9. El resultado DEBE ser JSON ESTRICTAMENTE VÁLIDO.
              10. NO uses markdown, comentarios ni explicaciones.
              11. Deben de ser frases cortas, no párrafos extensos.

              RESUMEN:
              - Incluye un resumen descriptivo.
              - El resumen NO debe contener citas textuales largas.

              FORMATO DE SALIDA OBLIGATORIO:
              Devuelve EXCLUSIVAMENTE este objeto JSON:

              {
                "VIDA_LABORAL": ["string"],
                "VIDA_PERSONAL": ["string"],
                "VIDA_AMOROSA": ["string"],
                "VIDA_FAMILIAR": ["string"],
                "resumen": "string"
              }
              `,
          },
          {
            role: "user",
            content: `Texto a analizar:\n${escrito}`,
          }],
        temperature: 0.2,
        max_output_tokens: 800,
      });
      const rawText = response.output[0].content[0].text;
      const clasificacion = JSON.parse(rawText);

      return { status: 200, clasificacion };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}

export default new ConsumeAI();
