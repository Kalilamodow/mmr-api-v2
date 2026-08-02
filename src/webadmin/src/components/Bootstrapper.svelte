<script lang="ts">
  import { apiStats, eventSourceWithPassword } from "../state";
  import Cell from "./Cell.svelte";

  let isBootstrapping = $state(false);
  let logs = $state<string[]>([]);

  const startBootstrapping = () => {
    isBootstrapping = true;
    const source = eventSourceWithPassword("./api/bootstrap");
    source.addEventListener("message", ({ data }: { data: string }) => {
      let toAdd = data;

      if (data.startsWith("Auth success!")) {
        toAdd = "Success!";
        source.close();
      } else if (data.includes("authorization_pending")) {
        toAdd = `Checked at ${new Date().toLocaleTimeString()}...`;
      }

      logs = [toAdd, ...logs];
    });
  };
</script>

<Cell name="Bootstrapper">
  {#if !$apiStats?.bootstrapped}
    {#if isBootstrapping}
      <textarea rows="40" cols="50">{logs.join("\n\n")}</textarea>
    {:else}
      <button type="button" onclick={startBootstrapping}>
        Start bootstrapping
      </button>
    {/if}
  {:else}
    Already bootstrapped!
  {/if}
</Cell>
