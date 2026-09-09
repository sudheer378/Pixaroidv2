export interface SeoPageData {
  title: string;
  description: string;
  h1: string;
  canonicalPath: string;
  primaryIntent: string;
  questions: readonly string[];
}

export interface AeoAnswerBlock {
  question: string;
  answer: string;
}

export interface GeoSignals {
  audience: "global";
  priorityMarkets: readonly string[];
  entityTerms: readonly string[];
  factualClaims: readonly string[];
}
