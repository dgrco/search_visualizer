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

// Subscribable graph data for node updating
export const dataStore = writable(graph);
export const updateData = (newData: Graph) => {
    dataStore.set(newData)
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
    for (let i = 0; i < Math.floor(windowHeight / 35); i++) {
        graph.nodes.push([]);
        for (let j = 0; j < Math.floor(windowWidth / 26); j++) {
            graph.nodes[i].push({ tile: Tile.Empty, xy: { x: j, y: i }, parent: undefined });
        }
    }

    if (graph.nodes.length > 0) {
        graph.nodes[0][0].tile = Tile.Start;
        graph.nodes[graph.nodes.length - 1][graph.nodes[0].length - 1].tile = Tile.End;
        graph.start = {x: 0, y: 0};
        graph.end = {x: graph.nodes[0].length - 1, y: graph.nodes.length - 1}
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

// set parent of node
export function setParent(node: GridNode, parent: GridNode) {
    graph.nodes[node.xy.y][node.xy.x].parent = parent;
}

// sets a cell to become a wall
export function setWall(pos: Coordinate) {
    graph.nodes[pos.y][pos.x].tile = Tile.Wall;
}

// get node at position pos
export function getNode(pos: Coordinate): GridNode {
    return graph.nodes[pos.y][pos.x];
}

// get node at position (x,y)
export function getNodeXY(x: number, y: number): GridNode {
    return graph.nodes[y][x];
}

// returns xy of start node
export function getStart() {
    return graph.nodes[graph.start.y][graph.start.x];
}

// returns xy of end node
export function getEnd() {
    return graph.nodes[graph.end.y][graph.end.x];
}

// return the number of rows
export function getRows() {
    return graph.nodes.length;
}

// return the number of columns
export function getCols() {
    return graph.nodes[0].length;
}

// get all surrounding neighbours of node
export function getNeighbours(node: GridNode): Array<GridNode> {
    let {x, y} = node.xy;
    let neighbours: Array<GridNode> = [];
    if (x == 0) {
        neighbours.push(getNodeXY(x + 1, y));
    } else if (x == graph.nodes[0].length - 1) {
        neighbours.push(getNodeXY(x - 1, y));
    } else {
        neighbours.push(getNodeXY(x + 1, y));
        neighbours.push(getNodeXY(x - 1, y));
    }

    if (y == 0) {
        neighbours.push(getNodeXY(x, y + 1));
    } else if (y == graph.nodes.length - 1) {
        neighbours.push(getNodeXY(x, y - 1));
    } else {
        neighbours.push(getNodeXY(x, y + 1));
        neighbours.push(getNodeXY(x, y - 1));
    }

    return neighbours;
}
