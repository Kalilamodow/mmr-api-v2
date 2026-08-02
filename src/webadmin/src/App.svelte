<script lang="ts">
  import Login from "./Login.svelte";
  import { apiStats, isAuthenticated } from "./state";
</script>

{#if $isAuthenticated}
  Bootstrapped: {$apiStats?.bootstrapped}
{:else}
  <Login />
{/if}
