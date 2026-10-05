import type { ModelAverage } from "./models";
import type { Decision } from "./scenarios";

export interface AnswerRecord {
  scenarioId: string;
  decision: Decision;
  expectedDecision: Decision;
  correct: boolean;
}

export type ComparisonLabel = "You beat it" | "It beat you" | "Roughly tied";

export function calculateScore(answers: readonly AnswerRecord[]): number {
  return answers.filter((answer) => answer.correct).length;
}

export function calculatePercentage(score: number, total: number): number {
  return Math.round((score / total) * 100);
}

export function compareWithModel(score: number, modelAverage: number): ComparisonLabel {
  if (score === modelAverage) return "Roughly tied";
  return score > modelAverage ? "You beat it" : "It beat you";
}

export function getResultMessage(score: number): string {
  switch (score) {
    case 14:
      return "🏆 Perfect score. You beat every model in the experiment, including GPT-5.6 Sol. Maybe I should benchmark more humans.";
    case 13:
      return "🔥 Very nice. You are basically sitting between GPT-5.6 Sol and Gemini 3.7 Flash. Not a bad place to be.";
    case 12:
      return "😎 Strong result. You are right in the pack with GPT-5.6 Luna and Claude Sonnet 5.";
    case 11:
      return "👏 Solid. You beat DeepSeek-R1 on average and are getting close to the stronger models.";
    case 10:
      return "😄 You still beat Claude Haiku 4.5, and DeepSeek-R1 is starting to look nervous.";
    case 9:
      return "🤝 You and Claude Haiku 4.5 have something in common.";
    default:
      return "😅 The models got you this time. But now you also know why retry logic is trickier than it looks.";
  }
}

export function getComparisonLine(
  score: number,
  models: readonly ModelAverage[],
): string {
  const beatenModels = models.filter((model) => score > model.average);

  if (beatenModels.length === models.length) {
    return "You beat every model's average score.";
  }

  if (beatenModels.length === 0) {
    const tiedModels = models.filter((model) => score === model.average);
    if (tiedModels.length > 0) {
      return `You matched ${formatModelList(tiedModels.map((model) => model.name))}.`;
    }
    return "The model pack takes this round.";
  }

  return `You beat ${formatModelList(beatenModels.map((model) => model.name))}.`;
}

function formatModelList(names: readonly string[]): string {
  if (names.length === 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;

  const leadingNames = names.slice(0, -1).join(", ");
  return `${leadingNames}, and ${names.at(-1)}`;
}
