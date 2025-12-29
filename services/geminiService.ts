
import { GoogleGenAI, Type } from "@google/genai";
import { AssertionRewriteResponse } from "../types";

const SYSTEM_INSTRUCTION = `Você é o "Cebraspe Architect", uma IA especialista na metodologia, estilo linguístico e profundidade teórica da banca examinadora Cebraspe.
Sua função é gerar 5 (cinco) reescritas de uma assertiva original, mantendo o sentido original (valor de verdade), mas alterando a estrutura sintática, o vocabulário e o foco argumentativo.

REGRAS DE OURO:
1. Vocabulário Cebraspe: Use "prescinde", "imprescinde", "mitigar", "eivar", "óbice", "defeso", "facultado", "preconiza", "conquanto", "não obstante".
2. Inversões Sintáticas: Altere a ordem direta.
3. Troca de Voz: Use voz passiva sintética/analítica.
4. Rigor Jurídico/Técnico: Mantenha terminologia de tribunais superiores ou padrões técnicos.
5. Imutabilidade Semântica: O julgamento (Certo/Errado) deve ser idêntico ao original.

Retorne o resultado estritamente em formato JSON seguindo o esquema definido.`;

export const generateRewrites = async (assertion: string): Promise<AssertionRewriteResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Assertiva original para reescrita: "${assertion}"`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          variations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Cinco variações da assertiva original no estilo Cebraspe."
          },
          examinerNote: {
            type: Type.STRING,
            description: "Nota explicativa detalhando os termos e estruturas alterados para dificultar a interpretação."
          }
        },
        required: ["variations", "examinerNote"]
      }
    }
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr) as AssertionRewriteResponse;
};
