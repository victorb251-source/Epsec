
export type Judgement = 'C' | 'E';

export interface SimulatedItem {
  id: number;
  text: string;
  correctJudgement: Judgement;
  dissection: string;
  taxonomy: string; 
}

export interface Flashcard {
  theme: string;
  summary: string;
  venom: string;
}

export interface Simulado5Response {
  title: string;
  crossReference?: string;
  hypotheticalSituation?: string;
  items: SimulatedItem[];
  flashcard: Flashcard;
  peripheralRadar: {
    topic: string;
    context: string;
  };
}

export interface UserAnswers {
  [key: number]: Judgement | null;
}
