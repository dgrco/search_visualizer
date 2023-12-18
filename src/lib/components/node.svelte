<script lang="ts">
	import type { Coordinate } from './graph';
	import { Tile, setWall, dataStore, tileStore, setStart, setEnd, setEmpty } from './graph';
	import type { Graph } from './graph';

	export let pos: Coordinate;
	export let graph: Graph;
	let tile: Tile = Tile.Empty;
    let selectedTile: Tile = Tile.Wall;
	$: {
		tile = $dataStore.nodes[pos.y][pos.x].tile;
        selectedTile = $tileStore.tile;
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
							: tile == Tile.Empty
                                ? 'empty'
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
                if (selectedTile == Tile.Wall) {
				    tile = Tile.Wall;
				    setWall(pos);
                } else if (selectedTile == Tile.Start) {
                    tile = Tile.Start
                    setStart(pos);
                } else if (selectedTile == Tile.End) {
                    tile = Tile.End;
                    setEnd(pos);
                } 
			} else if (tile == Tile.Wall) {
                if (selectedTile == Tile.Empty) {
                    tile = Tile.Empty;
                    setEmpty(pos);
                }
            }
		}
	}
</script>

{#key tile}
	<td
		on:mousemove={() => {
			updateNode(false);
		}}
		on:mousedown={() => {
			updateNode(true);
		}}
	>
		<div class={active_class}></div>
	</td>
{/key}

<style>
	td {
		border: 1px solid #5194a8;
		margin: 0;
		width: 26px;
		height: 30px;
		transition: 70ms ease-in-out;
		padding: 0;
	}

	td:hover {
		backdrop-filter: brightness(40%);
	}

	.wall {
		background-color: #1f1f1f;
		width: 100%;
		height: 100%;
		animation: grow 150ms ease-in-out forwards;
	}
	
    .empty {
		background-color: white;
		width: 100%;
		height: 100%;
		animation: grow 150ms ease-in-out forwards;
	}

	.start {
		background-color: #32a852;
		width: 100%;
		height: 100%;
		animation: grow 150ms ease-in-out forwards;
	}

	.end {
		background-color: #820808;
		width: 100%;
		height: 100%;
		animation: grow 150ms ease-in-out forwards;
	}

	.expanded {
		animation: grow 900ms ease-in-out forwards,
            expandFade 1.2s ease-in-out 200ms forwards;
	}

    td:has(.path), td:has(.wall), td:has(.start), td:has(.end) {
        border: none;
    }

	.path {
		background-color: #f0e962;
		animation: grow 400ms ease-in-out forwards;
        border: none;
	}

	div {
		margin: auto auto;
		border-collapse: collapse;
	}

	@keyframes grow {
		from {
			width: 0;
            border-radius: 100px;
			height: 0;
			opacity: 0;
		}
		to {
			width: 100%;
			height: 100%;
            border-radius: 0;
			opacity: 100%;
		}
	}

	@keyframes expandFade {
		from {
			background-color: rgba(131, 79, 214, 0.9);
		}
		to {
			background-color: rgba(79, 187, 214, 0.6);
		}
	}
</style>
