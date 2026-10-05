<script lang="ts">
  import { onMount, tick } from "svelte";
  import Home from "./components/Home.svelte";
  import Quiz from "./components/Quiz.svelte";
  import Results from "./components/Results.svelte";
  import Review from "./components/Review.svelte";
  import ScenarioBrowser from "./components/ScenarioBrowser.svelte";
  import SiteFooter from "./components/SiteFooter.svelte";
  import SiteHeader from "./components/SiteHeader.svelte";
  import type { Route } from "./routes";
  import { calculateScore, type AnswerRecord } from "./scoring";
  import { scenarios, type Decision } from "./scenarios";

  let route: Route = getRoute();
  let currentIndex = 0;
  let selectedDecision: Decision | null = null;
  let confirmedAnswer: AnswerRecord | null = null;
  let answers: AnswerRecord[] = [];

  $: currentScenario = scenarios[currentIndex];
  $: hasResults = answers.length === scenarios.length;
  $: documentTitle = getDocumentTitle(route, currentIndex);

  onMount(() => {
    const handleHashChange = () => {
      const requestedRoute = getRoute();
      route = (requestedRoute === "results" || requestedRoute === "review") && !hasResults
        ? "home"
        : requestedRoute;
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  });

  function getRoute(): Route {
    const hash = window.location.hash.slice(1);
    if (hash === "quiz" || hash === "scenarios" || hash === "results" || hash === "review") {
      return hash;
    }
    return "home";
  }

  function navigate(nextRoute: Route): void {
    const nextHash = `#${nextRoute}`;
    if (window.location.hash === nextHash) {
      route = nextRoute;
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.location.hash = nextHash;
    }
  }

  function startQuiz(): void {
    currentIndex = 0;
    selectedDecision = null;
    confirmedAnswer = null;
    answers = [];
    navigate("quiz");
  }

  function selectDecision(decision: Decision): void {
    if (confirmedAnswer) return;
    selectedDecision = decision;
  }

  async function confirmCurrentAnswer(): Promise<void> {
    if (!currentScenario || !selectedDecision || confirmedAnswer) return;

    const answer: AnswerRecord = {
      scenarioId: currentScenario.id,
      decision: selectedDecision,
      expectedDecision: currentScenario.expectedDecision,
      correct: selectedDecision === currentScenario.expectedDecision,
    };
    answers = [...answers, answer];
    confirmedAnswer = answer;
    await tick();
    document.querySelector<HTMLElement>(".feedback")?.focus({ preventScroll: true });
  }

  function advanceQuiz(): void {
    if (!confirmedAnswer) return;
    if (currentIndex === scenarios.length - 1) {
      navigate("results");
      return;
    }

    currentIndex += 1;
    selectedDecision = null;
    confirmedAnswer = null;
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function getDocumentTitle(currentRoute: Route, scenarioIndex: number): string {
    const titles: Record<Route, string> = {
      home: "To Retry or Not to Retry?",
      quiz: `Scenario ${scenarioIndex + 1} · Retry Benchmark`,
      scenarios: "Scenarios & Answers · Retry Benchmark",
      results: "Your Results · Retry Benchmark",
      review: "Answer Review · Retry Benchmark",
    };
    return titles[currentRoute]!;
  }
</script>

<svelte:head><title>{documentTitle}</title></svelte:head>

<SiteHeader {route} {hasResults} />

{#if route === "home"}
  <Home onStartQuiz={startQuiz} />
{:else if route === "quiz" && currentScenario}
  <Quiz
    scenario={currentScenario}
    scenarioIndex={currentIndex}
    totalScenarios={scenarios.length}
    {selectedDecision}
    {confirmedAnswer}
    correctAnswers={calculateScore(answers)}
    answeredCount={answers.length}
    onSelect={selectDecision}
    onConfirm={confirmCurrentAnswer}
    onNext={advanceQuiz}
  />
{:else if route === "scenarios"}
  <ScenarioBrowser onStartQuiz={startQuiz} />
{:else if route === "results"}
  <Results {answers} onTryAgain={startQuiz} onReview={() => navigate("review")} />
{:else if route === "review"}
  <Review {answers} />
{/if}

<SiteFooter />
