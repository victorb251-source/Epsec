
export interface AssertionRewriteResponse {
  variations: string[];
  examinerNote: string;
}

export interface HistoryItem {
  id: string;
  original: string;
  rewrites: AssertionRewriteResponse;
  timestamp: number;
}
