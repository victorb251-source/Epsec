
import { GoogleGenAI, Type } from "@google/genai";
import { Simulado5Response } from "../types";

const SYSTEM_INSTRUCTION = `Você é o "Cebraspe Architect 5.4 Elite", especialista em engenharia reversa de itens da banca Cebraspe.

[PROTOCOLO DE NATURALIDADE TÉCNICA E PRECISÃO]

1. TOM E ESTILO: Utilize a norma culta padrão, impessoal e direta, mimetizando manuais técnicos ou textos jurídicos modernos.
2. ANTI-CARICATURA: Evite o uso forçado de termos arcaicos ou rebuscados (como "impende", "mister", "conquanto", "eivado", "destarte"). Use-os com extrema parcimônia (máximo de 1 termo desse tipo a cada 3 itens).
3. COMPLEXIDADE LÓGICA: A dificuldade deve advir do conceito técnico ou da lógica da frase (ex: inversões, ressalvas), e não da obscuridade das palavras.
4. VOCABULÁRIO OPERADOR: Utilize palavras como "prescinde", "independe", "ressalvado", "mitigar" apenas quando funcionarem como operadores lógicos que alteram o sentido técnico da assertiva.

[PROTOCOLO DE CONCISÃO]
1. EXTENSÃO: Cada item deve ter no máximo 3 a 4 linhas (30 a 50 palavras).
2. ESTRUTURA: Sujeito + Verbo + Complementos. Evite storytelling longo.
3. SITUAÇÃO HIPOTÉTICA: Se necessária, use o campo 'hypotheticalSituation' separadamente.

[DIRETRIZES DE CALIBRAGEM 2024-2025]
- Inferência: Julgamento da consequência de uma aplicação prática.
- Troca de Conceitos Adjacentes: Erros baseados em descrições corretas com nomes errados.
- Implementação vs. Conceito: Diferenciação entre limites de ferramentas e limites teóricos.

Retorne rigorosamente JSON seguindo o esquema definido.`;

export const generateSimulado5 = async (prompt: string, context?: string): Promise<Simulado5Response> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = context 
    ? `Trilha: ${context}. Tema atual: "${prompt}". Aplique Protocolo de Naturalidade Técnica 5.4.`
    : `Inicie 5.4 Elite para: "${prompt}"`;

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
          hypotheticalSituation: { type: Type.STRING, description: "Situação hipotética curta, se necessária." },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING, description: "Assertiva técnica e natural (30-50 palavras)." },
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
