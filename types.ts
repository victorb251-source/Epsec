
export type Judgement = 'C' | 'E';

export interface SimulatedItem {
  id: number;
  text: string;
  correctJudgement: Judgement;
  dissection: string;
}

export interface MicroSimuladoResponse {
  originalAnalysis: string; // C/E logic of input
  summary: string;
  items: SimulatedItem[];
  legalBasis: string;
}

export interface UserAnswers {
  [key: number]: Judgement | null;
}
