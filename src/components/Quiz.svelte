<script lang="ts">
  import type { AnswerRecord } from "../scoring";
  import { decisionLabels, type Decision, type Scenario } from "../scenarios";
  import CodeBlock from "./CodeBlock.svelte";
  import DecisionBadge from "./DecisionBadge.svelte";

  export let scenario: Scenario;
  export let scenarioIndex: number;
  export let totalScenarios: number;
  export let selectedDecision: Decision | null;
  export let confirmedAnswer: AnswerRecord | null;
  export let correctAnswers: number;
  export let answeredCount: number;
  export let onSelect: (decision: Decision) => void;
  export let onConfirm: () => void;
  export let onNext: () => void;

  const decisions: readonly Decision[] = ["YES", "NO", "YES_AFTER_DELAY"];
</script>

<main class="page quiz-page" id="main-content">
  <section class="quiz-progress">
    <div class="quiz-progress-header">
      <span>Scenario {scenarioIndex + 1} of {totalScenarios}</span>
      <span>Correct: {correctAnswers} / {answeredCount} answered</span>
    </div>
    <div
      class="progress-track"
      role="progressbar"
      aria-label="Benchmark progress"
      aria-valuemin="0"
      aria-valuemax={totalScenarios}
      aria-valuenow={answeredCount}
    >
      <span class="progress-fill" style:width={`${(answeredCount / totalScenarios) * 100}%`}></span>
    </div>
  </section>

  <article class="scenario-card">
    <header class="scenario-heading">
      <p class="eyebrow">CASE {String(scenarioIndex + 1).padStart(2, "0")}</p>
      <h1>{scenario.title}</h1>
      <p>{scenario.shortDescription}</p>
    </header>

    <CodeBlock task={scenario.task} />

    <fieldset class="answer-fieldset" disabled={confirmedAnswer !== null}>
      <legend>What should the client do?</legend>
      <div class="answer-grid">
        {#each decisions as decision}
          <input
            id={`answer-${decision.toLowerCase()}`}
            name="retry-decision"
            type="radio"
            value={decision}
            checked={selectedDecision === decision}
            onchange={() => onSelect(decision)}
          />
          <label
            for={`answer-${decision.toLowerCase()}`}
            class="answer-card"
            class:answer-yes={decision === "YES"}
            class:answer-no={decision === "NO"}
            class:answer-yes-after-delay={decision === "YES_AFTER_DELAY"}
            class:is-selected={selectedDecision === decision}
            class:is-expected={confirmedAnswer !== null && scenario.expectedDecision === decision}
            class:is-incorrect={confirmedAnswer !== null && selectedDecision === decision && selectedDecision !== scenario.expectedDecision}
          >
            <span class="radio-indicator" aria-hidden="true"></span>
            <strong>{decision}</strong>
            <span>{decisionLabels[decision]}</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <div class="quiz-actions">
      {#if confirmedAnswer === null}
        <button
          class="button button-primary button-wide"
          type="button"
          disabled={selectedDecision === null}
          onclick={onConfirm}
        >Confirm answer</button>
        <p class="keyboard-hint">Choose one answer to continue.</p>
      {:else}
        <section
          class:feedback-correct={confirmedAnswer.correct}
          class:feedback-incorrect={!confirmedAnswer.correct}
          class="feedback"
          role="status"
          aria-live="polite"
          tabindex="-1"
        >
          <div class="feedback-heading">
            <span class="feedback-icon" aria-hidden="true">{confirmedAnswer.correct ? "✓" : "×"}</span>
            <strong>{confirmedAnswer.correct ? "Correct" : "Not quite"}</strong>
          </div>
          <div class="feedback-result">
            {#if !confirmedAnswer.correct}
              <span>You chose: </span><DecisionBadge decision={confirmedAnswer.decision} />
            {/if}
            <span>Expected: </span><DecisionBadge decision={scenario.expectedDecision} />
          </div>
          <div class="feedback-reason">
            <span class="reason-label">WHY</span>
            <p>{scenario.reason}</p>
          </div>
        </section>

        <button class="button button-primary button-next" type="button" onclick={onNext}>
          {scenarioIndex === totalScenarios - 1 ? "See my results →" : "Next scenario →"}
        </button>
      {/if}
    </div>
  </article>
</main>
