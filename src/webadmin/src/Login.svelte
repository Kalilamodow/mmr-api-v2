<script lang="ts">
  import { loadStats } from "./state";

  let loading = $state(false);
  let passwordTxt = $state("");

  const login = async () => {
    loading = true;
    await loadStats(passwordTxt);
    loading = false;
  };
</script>

<h2>Login</h2>

<input type="text" bind:value={passwordTxt} disabled={loading} />
<button type="button" onclick={login}>Log in</button>
