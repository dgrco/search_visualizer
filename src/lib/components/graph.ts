import { writable } from "svelte/store";

let graph: Graph = {
    nodes: [],
    start: { x: -1, y: -1 },
    end: { x: -1, y: -1 },
};

export enum Tile {
    Empty,
    Wall,
    Start,
    End,
    Expanded,
    Path
}

export type SelectedTile = {
    tile: Tile;
}

// Subscribable graph data for node updating
export const dataStore = writable(graph);
export const updateData = (newData: Graph) => {
    dataStore.set(newData)
}

// Handles tile selection
let selectedTile: SelectedTile = {tile: Tile.Wall};
export const tileStore = writable(selectedTile);
export const updateSelectedTile = (newTile: SelectedTile) => {
    tileStore.set(newTile);
}

export type Graph = {
    nodes: Array<Array<GridNode>>;
    start: Coordinate;
    end: Coordinate;
};

// XY coordinate
export type Coordinate = {
    x: number;
    y: number;
}

// The node structure (each cell in the graph)
export type GridNode = {
    tile: number;
    xy: Coordinate; // starting (0,0) in top left of grid
    parent: GridNode | undefined;
}

// (re)initialize the graph -> wipes data on resize
export function initGraph(windowWidth: number, windowHeight: number): Graph {
    graph.nodes = [];
    let heightDiv = windowWidth < 768 ? 44 : 38;
    let widthDiv = windowHeight < 768 ? 40 : 32;
    for (let i = 0; i < Math.floor(windowHeight / heightDiv); i++) {
        graph.nodes.push([]);
        for (let j = 0; j < Math.floor(windowWidth / widthDiv); j++) {
            graph.nodes[i].push({ tile: Tile.Empty, xy: { x: j, y: i }, parent: undefined });
        }
    }

    if (graph.nodes.length > 0) {
        let start = {
            x: Math.floor((graph.nodes[0].length - 1) / 2),
            y: Math.floor((graph.nodes.length - 1) / 2)
        };
        let end = {
            x: graph.nodes[0].length - 1,
            y: graph.nodes.length - 1
        };
        graph.nodes[start.y][start.x].tile = Tile.Start;
        graph.nodes[end.y][end.x].tile = Tile.End;
        graph.start = start;
        graph.end = end
    }

    updateData(graph);

    return graph;
}

// get the tile at pos
export function getTile(pos: Coordinate) {
    return graph.nodes[pos.y][pos.x].tile;
}

// set the tile at pos
export function setTile(pos: Coordinate, tile: Tile) {
    graph.nodes[pos.y][pos.x].tile = tile;
    updateData(graph);
}

/** Set parent of node */
export function setParent(node: GridNode, parent: GridNode) {
    graph.nodes[node.xy.y][node.xy.x].parent = parent;
}

/** Sets a node at `pos` to become a wall */
export function setWall(pos: Coordinate) {
    graph.nodes[pos.y][pos.x].tile = Tile.Wall;
}

/** Sets a node at `pos` to empty */
export function setEmpty(pos: Coordinate) {
    graph.nodes[pos.y][pos.x].tile = Tile.Empty;
}

/** Get node at position `pos` */
export function getNode(pos: Coordinate): GridNode {
    return graph.nodes[pos.y][pos.x];
}

/** Get node at position (x, y) */
export function getNodeXY(x: number, y: number): GridNode {
    return graph.nodes[y][x];
}

/** Returns the start node */
export function getStart() {
    return graph.nodes[graph.start.y][graph.start.x];
}

/** Sets the start position */
export function setStart(pos: Coordinate) {
    setTile(getStart().xy, Tile.Empty);
    graph.start = pos;
    setTile(pos, Tile.Start);
}

/** Returns the end node */
export function getEnd() {
    return graph.nodes[graph.end.y][graph.end.x];
}

/** Sets the end position */
export function setEnd(pos: Coordinate) {
    setTile(getEnd().xy, Tile.Empty);
    graph.end = pos;
    setTile(pos, Tile.End);
}

/** Return the number of rows in the graph. */
export function getRows() {
    return graph.nodes.length;
}

/** Returns the number of columns in the graph */
export function getCols() {
    return graph.nodes[0].length;
}

/** 
    * Get all surrounding neighbours of node
*/
export function getNeighbours(node: GridNode): Array<GridNode> {
    let { x, y } = node.xy;
    let neighbours: Array<GridNode> = [];
    if (x == 0) {
        neighbours.push(getNodeXY(x + 1, y));
    } else if (x == graph.nodes[0].length - 1) {
        neighbours.push(getNodeXY(x - 1, y));
    } else {
        neighbours.push(getNodeXY(x - 1, y));
        neighbours.push(getNodeXY(x + 1, y));
    }

    if (y == 0) {
        neighbours.push(getNodeXY(x, y + 1));
    } else if (y == graph.nodes.length - 1) {
        neighbours.push(getNodeXY(x, y - 1));
    } else {
        neighbours.push(getNodeXY(x, y - 1));
        neighbours.push(getNodeXY(x, y + 1));
    }

    return neighbours;
}
