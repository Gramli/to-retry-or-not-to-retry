<script lang="ts">
  import { calculateScore, type AnswerRecord } from "../scoring";
  import { scenarios } from "../scenarios";
  import DecisionBadge from "./DecisionBadge.svelte";

  export let answers: readonly AnswerRecord[];

  $: score = calculateScore(answers);
</script>

<main class="page review-page" id="main-content">
  <header class="page-intro review-intro">
    <div>
      <p class="eyebrow">ANSWER REVIEW</p>
      <h1>Your decisions, debriefed.</h1>
      <p>{score} correct out of {scenarios.length}. Expand any case to revisit the reasoning.</p>
    </div>
    <a class="button button-secondary" href="#results">← Back to results</a>
  </header>

  <section class="review-list" aria-label="Review of your answers">
    {#each scenarios as scenario, index}
      {@const answer = answers.find((entry) => entry.scenarioId === scenario.id)}
      {#if answer}
        <details class="review-card" class:review-correct={answer.correct} class:review-incorrect={!answer.correct}>
          <summary>
            <span class="review-marker" aria-hidden="true">{answer.correct ? "✓" : "×"}</span>
            <span class="review-title">
              <span>Scenario {index + 1}</span>
              <strong>{scenario.title}</strong>
            </span>
            <span class="review-summary-answer">
              <small>YOUR ANSWER</small>
              <DecisionBadge decision={answer.decision} />
            </span>
            <span class="disclosure-icon" aria-hidden="true">+</span>
          </summary>
          <div class="review-body">
            <div class="review-answer-grid">
              <div><span>You chose</span><DecisionBadge decision={answer.decision} /></div>
              <div><span>Expected</span><DecisionBadge decision={answer.expectedDecision} /></div>
            </div>
            <p>{scenario.reason}</p>
          </div>
        </details>
      {/if}
    {/each}
  </section>
</main>
