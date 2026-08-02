<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    name: string;
    children: Snippet;
  };

  let { name, children }: Props = $props();
</script>

<div class="app-cell">
  <h3>{name}</h3>
  {@render children()}
</div>

<style>
  .app-cell {
    background-color: #eeeeef;
    border-radius: 8px;
    padding: 16px;
  }

  .app-cell h3 {
    padding-top: 0;
    margin-top: 4px;
  }
</style>
