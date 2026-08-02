<script lang="ts">
  import { fetchWithPassword, isAuthenticated } from "../state";
  import Cell from "./Cell.svelte";

  type CurrentAuth = {
    auth: {
      accountId: string;
      accessToken: string;
      refreshToken: string;
    } | null;
  };
  let currentAuth = $state<CurrentAuth | null>(null);

  async function load() {
    const response = await fetchWithPassword("./api/currentauth");
    currentAuth = await response.json();
  }

  $effect(() => {
    if ($isAuthenticated) {
      load();
    }
  });
</script>

{#if currentAuth}
  <Cell name="Current auth">
    {#if currentAuth.auth !== null}
      <table>
        <tbody>
          <tr>
            <th>Account id</th>
            <td>{currentAuth.auth.accountId}</td>
          </tr>
          <tr>
            <th>Access token</th>
            <td>{currentAuth.auth.accessToken}</td>
          </tr>
          <tr>
            <th>Refresh token</th>
            <td>{currentAuth.auth.refreshToken}</td>
          </tr>
        </tbody>
      </table>
    {:else}
      None (needs bootstrap)
    {/if}
  </Cell>
{:else}
  Loading...
{/if}
