<script lang="ts">
  export let onStartQuiz: () => void;

  const heroArtwork = `${import.meta.env.BASE_URL}assets/retry-benchmark-sketch.jpg`;
</script>

<main class="page home-page" id="main-content">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">THE HUMAN RETRY BENCHMARK</p>
      <h1>
        <span>To</span>
        <span class="title-retry title-retry-yes">Retry</span>
        <span class="title-connector">or Not to</span>
        <span class="title-retry title-retry-no">Retry?</span>
      </h1>
      <p class="hero-subtitle">
        Can you beat the AI models at deciding when an API request should be retried?
      </p>
      <p class="hero-intro">
        I used these scenarios to benchmark AI models on retry decisions. You can either take the same
        test yourself or browse all scenarios and explanations.
      </p>
      <div class="hero-actions" aria-label="Choose how to explore the benchmark">
        <button class="button button-primary hero-action" type="button" onclick={onStartQuiz}>
          Take the test →
        </button>
        <a class="button hero-action hero-action-reference" href="#scenarios">
          Browse scenarios & answers
        </a>
      </div>
      <p class="hero-meta">14 scenarios · about 5–10 minutes · no signup</p>
      <div class="hero-resource-links" aria-label="Benchmark resources">
        <a
          href="https://www.kaggle.com/benchmarks/danielbalcarek/reasoning-about-retry-safety-in-api/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
        >Kaggle leaderboard <span aria-hidden="true">↗</span></a>
        <a href="https://dev.to/gramli" target="_blank" rel="noopener noreferrer">
          DEV.to article <small>coming soon</small> <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>

    <figure class="hero-art">
      <img
        src={heroArtwork}
        alt="A sketch of a puzzled robot deciding whether a failed payment request should be retried"
      />
      <figcaption>Status codes are only the beginning.</figcaption>
    </figure>
  </section>

  <section class="trust-strip" aria-label="Benchmark details">
    <div><strong>14</strong><span>scenarios</span></div>
    <div><strong>3</strong><span>possible decisions</span></div>
    <div><strong>0</strong><span>answers collected</span></div>
    <p>Everything runs locally in your browser. Your answers are not collected.</p>
  </section>
</main>
