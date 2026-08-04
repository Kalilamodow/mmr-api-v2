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
  let logCategories = $state<Record<string, boolean>>({});

  async function load() {
    const response = await fetchWithPassword("./api/logs");
    logs = (await response.json()).logs;
    for (const log of logs!) {
      logCategories[log.from] = true;
    }
  }

  function filteredLogs(logs: LogEntry[]) {
    return logs.filter((l) => logCategories[l.from]);
  }

  $effect(() => {
    if ($isAuthenticated) {
      load();
    }
  });
</script>

{#if logs}
  <Cell name="Logs">
    <div class="category-selector">
      <strong>Only show from</strong>

      {#each Object.keys(logCategories) as category}
        <label for={category}>{category}</label>
        <input
          type="checkbox"
          id={category}
          bind:checked={logCategories[category]}
        />
      {/each}
    </div>

    <table>
      <tbody>
        {#each filteredLogs(logs) as log}
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

  div.category-selector {
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
  }

  div.category-selector strong {
    margin-right: 8px;
  }

  div.category-selector input[type="checkbox"] {
    margin-right: 4px;
  }
</style>
