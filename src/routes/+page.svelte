<script lang="ts">
	import {
		initGraph,
		setTile,
		type GridNode,
		Tile,
		updateSelectedTile,

		tileStore

	} from '$lib/components/graph';
	import Graph from '$lib/components/graph.svelte';
	import { Algorithm, run } from '$lib/components/pathfinding';

	$: width = 0; // width of window
	$: height = 0; // height of window
	$: graph = initGraph(width, height);

	$: (width, height), (graph = initGraph(width, height));

    $: selectedAlgorithm = Algorithm.BFS;

	// runs the search animation
	function runAnimation() {
		let result: Array<GridNode> = run(selectedAlgorithm);

		loopAnim(result, 15, 0);
	}

    // set selected tile
    function setSelectedTile(tile: Tile) {
        updateSelectedTile({tile});
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
					animPath(nodes[nodes.length - 1], 5);
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
			if (!node.parent) {
				console.log('Parent not found');
			} else {
				animPath(node.parent, delay);
			}
		}, delay);
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="app">
	<div class="controls">
        <div class="tiles">
			{#key selectedAlgorithm}
				<div class={'algoBtn ' + (selectedAlgorithm == Algorithm.BFS ? 'selected' : '')}>
					<button class="tile wall" on:click={() => selectedAlgorithm = Algorithm.BFS}>Breadth-First Search</button>
				</div>
				<div class={'algoBtn ' + (selectedAlgorithm == Algorithm.A_STAR ? 'selected' : '')}>
					<button class="tile wall" on:click={() => selectedAlgorithm = Algorithm.A_STAR}>A* Search</button>
				</div>
			{/key}
		</div>
		<button class="visualize" on:click={() => runAnimation()}>Start</button>
		<div class="tiles">
			{#key $tileStore}
				<div class={'tileBtn ' + ($tileStore.tile == Tile.Wall ? 'selected' : '')}>
					<button class="tile wall" on:click={() => setSelectedTile(Tile.Wall)}>Wall</button>
				</div>
				<div class={'tileBtn ' + ($tileStore.tile == Tile.Start ? 'selected' : '')}>
					<button class="tile start" on:click={() => setSelectedTile(Tile.Start)}>Start</button>
				</div>
				<div class={'tileBtn ' + ($tileStore.tile == Tile.End ? 'selected' : '')}>
					<button class="tile end" on:click={() => setSelectedTile(Tile.End)}>End</button>
				</div>
				<div class={'tileBtn ' + ($tileStore.tile == Tile.Empty ? 'selected' : '')}>
					<button class="tile floor" on:click={() => setSelectedTile(Tile.Empty)}>Floor</button>
				</div>
			{/key}
		</div>
	</div>
	{#key width | height}
		<Graph {graph} />
	{/key}
</div>

<style>
	.controls {
		display: flex;
		margin-top: auto;
		margin-bottom: 1em;
		justify-content: center;
	}

	.tiles {
		display: flex;
        justify-content: center;
        margin: 0 1rem;
	}

	.tile {
		border: none;
		width: 100%;
		height: 100%;
		cursor: pointer;
		transition: 150ms ease-in-out;
	}

	.tile:hover {
		opacity: 80%;
	}

	.wall {
		background-color: #1f1f1f;
		color: white;
	}

	.start {
		background-color: #32a852;
		color: white;
	}

    .floor {
        background-color: #d1d1d1;
    }

    .end {
        background-color: #820808;
        color: white;
    }

	.selected {
		border: 2px solid black;
	}

	.tileBtn {
		display: flex;
		padding: 1px;
        min-width: 3rem;
        min-height: 3rem;
        aspect-ratio: 1/1;
		margin-right: 10px;
	}
	
    .algoBtn {
		display: flex;
		padding: 1px;
		margin-right: 10px;
	}

	.visualize {
		font-size: 1.4rem;
		padding: 0.6rem 2.5rem;
		background-color: #05336e;
		color: white;
		border: 2px solid black;
		transition: 150ms ease-in-out;
        max-width: 35%;
        margin: 0 auto;
	}

	.visualize:hover {
		opacity: 80%;
		cursor: pointer;
	}

	.app {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 90vh;
		animation: fadeIn 800ms;
	}

    @media (max-width: 768px) {
        .controls {
            flex-direction: column;
        }
        .visualize {
            margin: 10px auto;
        }
        .algoBtn {
            min-height: 3rem;
        }
    }

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 100%;
		}
	}
</style>
