
import { GoogleGenAI, Type } from "@google/genai";
import { Simulado5Response } from "../types";

const SYSTEM_INSTRUCTION = `Você é o "Cebraspe Architect 5.3 Elite", especialista em engenharia reversa de itens da banca Cebraspe.

[PROTOCOLO DE CONCISÃO E SINTAXE CEBRASPE]

1. REGRA DE EXTENSÃO: Cada item deve ser direto e técnico, com no máximo 3 a 4 linhas (30 a 50 palavras). Proibido parágrafos explicativos ou storytelling dentro do item.
2. ESTRUTURA: Sujeito + Verbo + Complementos. Use inversões sintáticas e orações subordinadas para densidade técnica.
3. CONDENSAÇÃO: Evite linguajar prolixo. Use termos como "prescinde", "defeso", "mister", "conquanto". 
4. SITUAÇÃO HIPOTÉTICA: Se o tema exigir um caso prático, gere um texto curto (campo 'hypotheticalSituation') separado. Os itens devem referir-se a essa situação ou ao conceito técnico.

[DIRETRIZES DE CALIBRAGEM 2024-2025]
- Inferência: Exija que o usuário julgue a consequência de uma aplicação.
- Troca de Conceitos Adjacentes: Erros baseados em descrever um conceito corretamente mas nomeá-lo errado.
- Implementação vs. Conceito: Não confunda limitações de ferramentas com limitações teóricas.

FASE 1 (GERAÇÃO):
- 3 Itens (C/E) mistos.
- Itens curtos, densos e desafiadores.

FASE 2 (DIAGNÓSTICO):
- Taxonomia técnica (Troca de Conceitos, Restrição Indevida, etc.).
- Flashcard de Ouro e Radar Periférico.

Retorne rigorosamente JSON.`;

export const generateSimulado5 = async (prompt: string, context?: string): Promise<Simulado5Response> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = context 
    ? `Trilha: ${context}. Tema atual: "${prompt}". Aplique Protocolo de Concisão 5.3.`
    : `Inicie 5.3 Elite para: "${prompt}"`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título: 📝 Simulado Elite: [Tema]" },
          crossReference: { type: Type.STRING },
          hypotheticalSituation: { type: Type.STRING, description: "Situação hipotética curta, se necessária para o tema." },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING, description: "Assertiva curta (30-50 palavras)." },
                correctJudgement: { type: Type.STRING },
                dissection: { type: Type.STRING },
                taxonomy: { type: Type.STRING }
              },
              required: ["id", "text", "correctJudgement", "dissection", "taxonomy"]
            }
          },
          flashcard: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              summary: { type: Type.STRING },
              venom: { type: Type.STRING }
            },
            required: ["theme", "summary", "venom"]
          },
          peripheralRadar: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              context: { type: Type.STRING }
            },
            required: ["topic", "context"]
          }
        },
        required: ["title", "items", "flashcard", "peripheralRadar"]
      }
    }
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr) as Simulado5Response;
};
