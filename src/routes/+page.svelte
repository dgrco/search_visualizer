<script lang="ts">
	import { initGraph, setTile, type GridNode, Tile } from '$lib/components/graph';
	import Graph from '$lib/components/graph.svelte';
	import { Algorithm, run } from '$lib/components/pathfinding';

	$: width = 0; // width of window
	$: height = 0; // height of window
	$: graph = initGraph(width, height);

	$: (width, height), (graph = initGraph(width, height));

	function runAnimation(algo: Algorithm) {
		let result: Array<GridNode> = run(algo);

		loopAnim(result, 50, 0);
	}

	// sets expanded tiles and draws at a delay (in ms)
	function loopAnim(nodes: Array<GridNode>, delay: number, index: number) {
		setTimeout(() => {
			if (index < nodes.length) {
				if (nodes[index].tile == Tile.Empty) {
					setTile(nodes[index].xy, Tile.Expanded);
					loopAnim(nodes, delay, index + 1);
				} else {
					loopAnim(nodes, delay, index + 1);
                }
			} else {
                if (nodes[nodes.length - 1].tile == Tile.End) {
                    animPath(nodes[nodes.length - 1], 25);
                }
            }
		}, delay);
	}
        
    // animate the final path from index
    function animPath(node: GridNode, delay: number) {
		setTimeout(() => {
			if (node.tile == Tile.Expanded) {
                setTile(node.xy, Tile.Path);
            } 
            if (node.tile == Tile.Start) {
                return;
            }
            if (!node.parent){
                console.log("Parent not found");
            } else {
                animPath(node.parent, delay);
            }
		}, delay);
    }
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="app">
	<div class="controls">
		<button on:click={() => runAnimation(Algorithm.BFS)}>Start</button>
	</div>
	{#key width | height}
		<Graph {graph} />
	{/key}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 96vh;
	}
</style>
