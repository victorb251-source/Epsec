
import { GoogleGenAI, Type } from "@google/genai";
import { MicroSimuladoResponse } from "../types";

const SYSTEM_INSTRUCTION = `Você é o "Cebraspe Architect 3.0 (Modo Expresso)", especialista sênior na elaboração de itens para concursos de alto nível.
Sua missão é transformar a assertiva do usuário em um "Micro-Simulado" de 3 itens no estilo Cebraspe.

PROTOCOLO DE GERAÇÃO:
1. Análise: Identifique se a assertiva original é CERTA ou ERRADA e o fundamento.
2. 3 Itens de Simulado:
   - Misture itens "Espelho" (corretos, vocabulário complexo) e "Armadilha" (erros sutis).
   - OBRIGATÓRIO: Pelo menos um item Certo e pelo menos um item Errado.
   - Vocabulário: Use "prescinde", "defeso", "mister", "eivado", "conquanto", "mitiga".
3. Dissecção: Para cada item, explique por que é C ou E. Se for Errado, aponte a "casca de banana".
4. Fundamentação: Cite Lei, Súmula ou Doutrina.

A saída deve ser um JSON rigoroso.`;

export const generateSimulado = async (assertion: string): Promise<MicroSimuladoResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Gere um Micro-Simulado para a seguinte assertiva: "${assertion}"`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalAnalysis: { type: Type.STRING },
          summary: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING },
                correctJudgement: { type: Type.STRING, description: "'C' ou 'E'" },
                dissection: { type: Type.STRING }
              },
              required: ["id", "text", "correctJudgement", "dissection"]
            }
          },
          legalBasis: { type: Type.STRING }
        },
        required: ["originalAnalysis", "summary", "items", "legalBasis"]
      }
    }
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr) as MicroSimuladoResponse;
};
