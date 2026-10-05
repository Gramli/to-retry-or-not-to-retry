<script lang="ts">
  import { scenarios } from "../scenarios";
  import CodeBlock from "./CodeBlock.svelte";
  import DecisionBadge from "./DecisionBadge.svelte";

  export let onStartQuiz: () => void;
</script>

<main class="page browser-page" id="main-content">
  <header class="page-intro browser-intro">
    <div>
      <p class="eyebrow">THE FULL CASE FILE</p>
      <h1>Scenarios & answers</h1>
      <p>
        Prefer reading over taking the test? Here are all 14 scenarios, expected decisions, and explanations.
      </p>
    </div>
    <button class="button button-primary" type="button" onclick={onStartQuiz}>
      Take the test without spoilers →
    </button>
  </header>

  <section class="scenario-list" aria-label="All benchmark scenarios">
    {#each scenarios as scenario, index}
      <details class="browser-card">
        <summary>
          <span class="browser-number">{String(index + 1).padStart(2, "0")}</span>
          <span class="browser-summary-copy">
            <strong>{scenario.title}</strong>
            <span>{scenario.shortDescription}</span>
          </span>
          <DecisionBadge decision={scenario.expectedDecision} />
          <span class="disclosure-icon" aria-hidden="true">+</span>
        </summary>
        <div class="browser-content">
          <CodeBlock task={scenario.task} />
          <div class="browser-reason">
            <p class="reason-label">WHY THIS DECISION</p>
            <p>{scenario.reason}</p>
          </div>
        </div>
      </details>
    {/each}
  </section>

  <section class="inline-cta">
    <div>
      <p class="eyebrow">DONE READING?</p>
      <h2>See how your judgment compares.</h2>
      <p>Take the benchmark to unlock the human-versus-model scorecard.</p>
    </div>
    <button class="button button-primary" type="button" onclick={onStartQuiz}>Take the test →</button>
  </section>
</main>
