<script lang="ts">
	import type { Graph } from './graph';
	import Node from './node.svelte';

    export let graph: Graph;
</script>

<table>
	{#each Array(graph.nodes.length) as _, r}
		<tr>
			{#each Array(graph.nodes[0].length) as _, c}
				<Node pos={{ x: c, y: r }} graph={graph} />
			{/each}
		</tr>
	{/each}
</table>

<style>
	table {
		border-collapse: collapse;
		user-select: none;
	}

	table:hover {
		cursor: pointer;
	}
</style>
