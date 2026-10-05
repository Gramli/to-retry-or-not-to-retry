export interface ModelResult {
  name: string;
  runs: readonly [number, number, number];
}

export interface ModelAverage extends ModelResult {
  average: number;
}

export const modelResults: readonly ModelResult[] = [
  { name: "GPT-5.6 Sol", runs: [14, 14, 13] },
  { name: "Gemini 3.7 Flash", runs: [13, 13, 13] },
  { name: "Gemini 3.1 Pro Preview", runs: [12, 12, 13] },
  { name: "GLM-5", runs: [12, 13, 12] },
  { name: "Claude Sonnet 5", runs: [12, 12, 12] },
  { name: "GPT-5.6 Luna", runs: [12, 12, 12] },
  { name: "DeepSeek-R1", runs: [11, 10, 10] },
  { name: "Claude Haiku 4.5", runs: [9, 9, 9] },
] as const;

export const modelAverages: readonly ModelAverage[] = modelResults
  .map((model) => ({
    ...model,
    average: model.runs.reduce((sum, score) => sum + score, 0) / model.runs.length,
  }))
  .sort((first, second) => second.average - first.average);
