<script lang="ts">
  import { fetchWithPassword, isAuthenticated } from "../state";
  import Cell from "./Cell.svelte";

  type LogType = "info" | "warn" | "error";
  type LogEntry = {
    time: number;
    from: string;
    text: string;
    type: LogType;
  };
  let logs = $state<LogEntry[] | null>(null);

  async function load() {
    const response = await fetchWithPassword("./api/logs");
    logs = (await response.json()).logs;
  }

  $effect(() => {
    if ($isAuthenticated) {
      load();
    }
  });
</script>

{#if logs}
  <Cell name="Logs">
    <table>
      <tbody>
        {#each logs as log}
          <tr class="log-{log.type}">
            <th>{log.type}</th>
            <td>{new Date(log.time).toLocaleString()}</td>
            <td>[{log.from}] {log.text}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Cell>
{:else}
  Loading...
{/if}

<style>
  tr.log-warn {
    background-color: #f802;
  }

  tr.log-error {
    background-color: red;
    color: white;
  }
</style>
