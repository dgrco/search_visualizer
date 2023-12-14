<script lang="ts">
	import type { Coordinate } from './graph';
	import { Tile, setWall, dataStore } from './graph';
	import type { Graph } from './graph';

	export let pos: Coordinate;
	export let graph: Graph;
    let tile: Tile = Tile.Empty;
	$: {
        tile = $dataStore.nodes[pos.y][pos.x].tile;
    }
	$: active_class =
		tile == Tile.Wall
			? 'wall'
			: tile == Tile.Start
				? 'start'
				: tile == Tile.End
					? 'end'
					: tile == Tile.Expanded
						? 'expanded'
						: tile == Tile.Path
                            ? 'path'
                            : '';

	// handle mouse for dragging
	$: mouseDown = false;
	addEventListener('mousedown', (e) => {
		e.preventDefault();
		mouseDown = true;
	});
	addEventListener('mouseup', (e) => {
		e.preventDefault();
		mouseDown = false;
	});

	// set node on tile change
	function updateNode(ignore_event: boolean) {
		if (mouseDown || ignore_event) {
			if (tile == Tile.Empty) {
				tile = Tile.Wall;
				setWall(pos);
			}
		}
	}

</script>

{#key tile}
	<td
		class={active_class}
		on:mousemove={() => {
			updateNode(false);
		}}
		on:mousedown={() => {
			updateNode(true);
		}}
	/>
{/key}

<style>
	td {
		border: 1px solid #757575;
		margin: 0;
		width: 26px;
		height: 25px;
		transition: 70ms ease-in-out;
	}

	td:hover {
		backdrop-filter: brightness(40%);
	}

	.wall {
		background-color: #1f1f1f;
	}

	.start {
		background-color: #32a852;
	}

	.end {
		background-color: #820808;
	}

	.expanded {
		background-color: #2368d9;
	}

    .path {
        background-color: #e6db43;
    }
</style>
