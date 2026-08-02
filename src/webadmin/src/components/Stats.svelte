<script lang="ts">
  import { apiStats } from "../state";
  import Cell from "./Cell.svelte";
</script>

{#if $apiStats !== null}
  <Cell name="General">
    <table>
      <tbody>
        <tr>
          <th>Bootstrapped?</th>
          <td>{$apiStats.bootstrapped ? "Yes" : "No"}</td>
        </tr>
      </tbody>
    </table>
  </Cell>
{/if}
