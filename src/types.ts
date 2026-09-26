export interface PaperInfo {
  title: string;
  authors: string[];
  yearOrVenue: string;
  arxivId: string | null;
  primaryDomain: string;
  keyMetrics: string[];
}

export interface CoreConcept {
  problemStatement: string;
  primaryMethodology: string;
  mathematicalBreakthroughs: string;
  plainSummary: string;
  wordCount: number;
}

export interface FlowchartData {
  mermaidCode: string;
  description: string;
  nodesCount: number;
}

export interface InternshipOpportunity {
  id: number;
  title: string;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string[];
  difficulty: 'Beginner-Friendly' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  resumeBullet: string;
  starterSkeleton?: string;
}

export interface AnalysisResponseData {
  paper: PaperInfo;
  coreConcept: CoreConcept;
  flowchart: FlowchartData;
  internshipOpportunities: InternshipOpportunity[];
  rawRequiredText: string;
}

export interface TelemetryData {
  estimatedPromptTokens: number;
  estimatedCompletionTokens: number;
  totalTokens: number;
  tokenBudget: number;
  tokenBudgetRemaining: number;
  efficiencyRating: string;
  executionDurationMs: number;
  groundedSourcesCount: number;
  searchQueries: string[];
}
