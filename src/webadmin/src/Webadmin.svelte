<script lang="ts">
  import Bootstrapper from "./components/Bootstrapper.svelte";
  import CurrentAuth from "./components/CurrentAuth.svelte";
  import Logs from "./components/Logs.svelte";
  import Stats from "./components/Stats.svelte";
</script>

<h1>mmr-api-v2 admin</h1>

<Stats />
<CurrentAuth />
<Bootstrapper />
<Logs />
