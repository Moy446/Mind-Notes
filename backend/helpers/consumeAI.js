import axios from "axios";
import fs from "fs";

class ConsumeAI {
  constructor() {}
  async transcribe(audioPath) {
    const form = new FormData();
    form.append("audio", fs.createReadStream(audioPath));
    try {
      const response = await axios.post(
        process.env.TRANSCRIPTION_SERVICE_URL,
        form,
        { headers: form.getHeaders() },
      );
      return { status: 200, data: response.data };
    } catch (e) {
      return { status: 500, message: "Hubo un error en la transcripcion" };
    }
  }

  async diarize(audioPath) {
    try {
      const form = new FormData();
      form.append("audio", fs.createReadStream(audioPath));
      const response = await axios.post(
        process.env.DIARIZATION_SERVICE_URL,
        form,
        { headers: form.getHeaders() },
      );
      return { status: 200, data: response.data };
    } catch (e) {
      return { status: 500, message: "Hubo un error en la diarizacion" };
    }
  }

  async sumarize(text) {
    try {
      const response = await axios.post(process.env.SUMMARIZATION_SERVICE_URL, {
        text: text,
      });
      return { status: 200, data: response.data };
    } catch (e) {
      return {
        status: 500,
        message: "Hubo un error en la elaboracion del resumen",
      };
    }
  }

  async classify(escrito) {
    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [{
            role: "system",
            content: `
            Eres un psicólogo especializado en análisis narrativo y evaluación psicosocial.
            Tu tarea es analizar un texto y EXTRAER las frases o fragmentos textuales
            que correspondan a cada una de las siguientes dimensiones de vida:

            - VIDA_LABORAL: trabajo, empleo, estudios, carrera profesional, emprendimiento,
            ambiente laboral, salarios, jefes, compañeros, carga académica o laboral.
            - VIDA_PERSONAL: emociones, miedos, pensamientos, toma de decisiones,
            autoestima, crecimiento personal, motivaciones, frustraciones.
            - VIDA_AMOROSA: pareja, relaciones sentimentales, noviazgo, matrimonio,
            divorcio, rupturas, apoyo o conflicto con la pareja.
            - VIDA_FAMILIAR: padres, hijos, hermanos, familia, crianza,
            apoyo o conflicto familiar.

            INSTRUCCIONES IMPORTANTES:
            - Extrae SOLO frases que estén explícitamente presentes en el texto.
            - No inventes ni reformules el contenido original.
            - Si una frase pertenece a más de una categoría, inclúyela en todas las que correspondan.
            - Si no hay frases para una categoría, devuelve un arreglo vacío [].
            - Mantén la redacción ORIGINAL del texto (respeta mayúsculas y puntuación lo más posible).
            - Responde ÚNICAMENTE en formato JSON, sin explicaciones adicionales.

            Formato de salida obligatorio:

            {
            "VIDA_LABORAL": [string],
            "VIDA_PERSONAL": [string],
            "VIDA_AMOROSA": [string],
            "VIDA_FAMILIAR": [string]
            }`,
          },
          {
            role: "user",
            content: `Texto a analizar:\n"${escrito}"`,
          }],
        temperature: 0.2,
        max_tokens: 800,
      });
      return {
        status: 200,
        clasificacion: JSON.parse(response.choices[0].message.content),
      };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}

export default new ConsumeAI();
