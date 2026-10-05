<script lang="ts">
  import type { Decision } from "../scenarios";

  export let decision: Decision;

  $: decisionClass = `decision-${decision.toLowerCase().replaceAll("_", "-")}`;
</script>

<span class="decision-badge {decisionClass}">{decision}</span>
