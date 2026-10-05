<script lang="ts">
  import type { Route } from "../routes";

  export let route: Route;
  export let hasResults: boolean;

  const siteIcon = `${import.meta.env.BASE_URL}favicon.png`;

  const links: readonly { label: string; route: Route }[] = [
    { label: "Home", route: "home" },
    { label: "Take the test", route: "quiz" },
    { label: "Scenarios", route: "scenarios" },
  ];
</script>

<header class="site-header">
  <div class="site-header-inner">
    <a class="brand" href="#home">
      <span class="brand-mark" aria-hidden="true"><img src={siteIcon} alt="" /></span>
      <span><strong>RETRY</strong><small>DECISION LAB</small></span>
    </a>
    <nav aria-label="Main navigation">
      {#each links as link}
        <a
          href="#{link.route}"
          class:is-active={route === link.route}
          aria-current={route === link.route ? "page" : undefined}
        >{link.label}</a>
      {/each}
      {#if hasResults}
        <a
          href="#results"
          class:is-active={route === "results" || route === "review"}
          aria-current={route === "results" || route === "review" ? "page" : undefined}
        >Results</a>
      {/if}
    </nav>
  </div>
</header>
