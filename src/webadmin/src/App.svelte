<script lang="ts">
  import Login from "./Login.svelte";
  import { isAuthenticated, loadStats } from "./state";
  import Webadmin from "./Webadmin.svelte";

  const savedPassword = localStorage.getItem("mmr-api-v2__saved-password");
  if (savedPassword !== null) {
    loadStats(savedPassword);
  }
</script>

{#if $isAuthenticated}
  <Webadmin />
{:else}
  <Login />
{/if}
