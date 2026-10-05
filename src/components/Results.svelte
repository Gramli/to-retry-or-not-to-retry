<script lang="ts">
  import { modelAverages } from "../models";
  import {
    calculatePercentage,
    calculateScore,
    compareWithModel,
    getComparisonLine,
    getResultMessage,
    type AnswerRecord,
  } from "../scoring";
  import { scenarios } from "../scenarios";

  export let answers: readonly AnswerRecord[];
  export let onTryAgain: () => void;
  export let onReview: () => void;

  $: score = calculateScore(answers);
  $: percentage = calculatePercentage(score, scenarios.length);

  function comparisonClass(scoreValue: number, average: number): string {
    return `comparison-${compareWithModel(scoreValue, average).toLowerCase().replaceAll(" ", "-")}`;
  }
</script>

<main class="page results-page" id="main-content">
  <section class="score-card" aria-labelledby="result-heading">
    <p class="eyebrow">BENCHMARK COMPLETE</p>
    <h1 id="result-heading">Your result</h1>
    <div class="score-display">
      <strong>{score}</strong>
      <span>/ {scenarios.length}</span>
      <em>{percentage}%</em>
    </div>
    <p class="result-message">{getResultMessage(score)}</p>
    <p class="comparison-line">{getComparisonLine(score, modelAverages)}</p>
  </section>

  <div class="result-actions">
    <button class="button button-primary" type="button" onclick={onReview}>Review my answers</button>
    <button class="button button-secondary" type="button" onclick={onTryAgain}>Try again</button>
    <a class="button button-ghost" href="#scenarios">Browse all scenarios</a>
    <a class="button button-ghost" href="#home">Back to home</a>
  </div>

  <section class="results-section" aria-labelledby="model-comparison-heading">
    <div class="section-heading split-heading">
      <div>
        <p class="eyebrow">THREE-RUN AVERAGES</p>
        <h2 id="model-comparison-heading">How you compare with the models</h2>
      </div>
      <span class="human-score-chip">You: {score.toFixed(2)}</span>
    </div>

    <div class="table-scroll">
      <table>
        <thead>
          <tr><th scope="col">Model</th><th scope="col">Avg. score</th><th scope="col">Human result vs model</th></tr>
        </thead>
        <tbody>
          {#each modelAverages as model, index}
            <tr>
              <th scope="row"><span class="rank">{String(index + 1).padStart(2, "0")}</span>{model.name}</th>
              <td class="average-cell">{model.average.toFixed(2)}</td>
              <td>
                <span class="comparison-status {comparisonClass(score, model.average)}">
                  {compareWithModel(score, model.average)}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="finding-card">
    <span class="finding-number">6/24</span>
    <div>
      <p class="eyebrow">THE SCENARIO THAT FOOLED THE MODELS</p>
      <h2>Unsafe Payment Retry</h2>
      <p>
        Unsafe Payment Retry was answered correctly only <strong>6 out of 24 times</strong> across all
        three AI runs.
      </p>
      <p>
        Most models followed the obvious Retry-After signal even though retrying the payment without
        idempotency could create a duplicate charge.
      </p>
    </div>
  </section>

  <aside class="methodology">
    <strong>About the experiment</strong>
    <p>
      This is a small experimental benchmark, not a definitive ranking of AI models. Each model was
      tested on the same 14 scenarios across three runs. The goal was mainly to see where retry
      decisions differ and which scenarios cause problems.
    </p>
    <div class="methodology-links">
      <a
        class="methodology-link"
        href="https://www.kaggle.com/benchmarks/danielbalcarek/reasoning-about-retry-safety-in-api/leaderboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        Kaggle leaderboard <span aria-hidden="true">↗</span>
      </a>
      <a
        class="methodology-link"
        href="https://dev.to/gramli"
        target="_blank"
        rel="noopener noreferrer"
      >
        DEV.to article <small>coming soon</small> <span aria-hidden="true">↗</span>
      </a>
    </div>
  </aside>
</main>
