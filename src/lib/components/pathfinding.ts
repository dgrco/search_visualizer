import {
    getStart, setTile,
    type GridNode, Tile, getEnd, getNeighbours, setParent, type Coordinate
} from "./graph";
import PriorityQueue, { type SearchNode } from "./priorityqueue";

export enum Algorithm {
    BFS,
    A_STAR,
    DFS,
};

export function run(algo: Algorithm): Array<GridNode> {
    let search: Array<GridNode> = [];
    switch (algo) {
        case Algorithm.BFS:
            search = bfs();
            break;
        case Algorithm.A_STAR:
            search = a_star();
            break;
        case Algorithm.DFS:
            search = dfs();
            break;
    }

    return search;
}

// Breadth-First Search algorithm
function bfs(): Array<GridNode> {
    let startNode = getStart()
    let visited: Array<GridNode> = [];
    let arr = [startNode];

    while (arr.length > 0) {
        let node = arr.shift();

        if (node == undefined) {
            console.log("Undefined node in search");
            break;
        }

        if (inArray(visited, node)) {
            continue;
        }

        // mark node as expanded
        visited.push(node);

        if (node == getEnd()) {
            break;
        }

        let neighbours = getNeighbours(node);
        for (let i = 0; i < neighbours.length; i++) {
            if (neighbours[i].tile == Tile.Wall) { continue; }
            if (!inArray(visited, neighbours[i])) {
                setParent(neighbours[i], node);
                arr.push(neighbours[i]);
            }
        }
    }

    return visited;
}

// A* algorithm
function a_star(): Array<GridNode> {
    let start = getStart();
    let end = getEnd();
    let pqueue = new PriorityQueue();
    let visited: Array<GridNode> = [];

    pqueue.enqueue(start, 0, manhattanDistance(start.xy, end.xy));

    while (!pqueue.isEmpty()) {
        let current = pqueue.dequeue();

        if (inArray(visited, current!.node)) {
            continue;
        }

        visited.push(current!.node);
        if (current!.node == end) {
            break;
        }

        for (let neighbour of getNeighbours(current!.node)) {
            if (inArray(visited, neighbour)
                || neighbour.tile == Tile.Wall) { continue; }
            let cum_gCost = current!.gCost + 1; // TODO: change to weight
            let hCost = manhattanDistance(neighbour.xy, end.xy);

            let nodeIdx = indexOfNode(pqueue.getData(), neighbour);
            if (nodeIdx == -1) {
                pqueue.enqueue(neighbour, cum_gCost, hCost);
                neighbour.parent = current!.node;    
            } else {
                if (pqueue.decreaseKey(pqueue.getData()[nodeIdx], cum_gCost, hCost)) { 
                    neighbour.parent = current!.node;
                }
            }
        }
    }

    return visited;
}

// Depth-First Search algorithm
function dfs(): Array<GridNode> {
    let startNode = getStart()
    let visited: Array<GridNode> = [];
    let arr = [startNode];

    while (arr.length > 0) {
        let node = arr.pop();

        if (node == undefined) {
            console.log("Undefined node in search");
            break;
        }

        if (inArray(visited, node)) {
            continue;
        }

        // mark node as expanded
        visited.push(node);

        if (node == getEnd()) {
            break;
        }

        let neighbours = getNeighbours(node);
        for (let i = 0; i < neighbours.length; i++) {
            if (neighbours[i].tile == Tile.Wall) { continue; }
            if (!inArray(visited, neighbours[i])) {
                setParent(neighbours[i], node);
                arr.push(neighbours[i]);
            }
        }
    }

    return visited;
}

// Manhattan distance from p1 to p2
function manhattanDistance(p1: Coordinate, p2: Coordinate): number {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
}

// checks if a node is in the array of nodes
function inArray(arr: Array<GridNode>, node: GridNode) {
    for (let vNode of arr) {
        if (vNode.xy.x === node.xy.x && vNode.xy.y === node.xy.y) {
            return true;
        }
    }
    return false;
}

// index of element in searchnode array
function indexOfNode(arr: Array<SearchNode>, node: GridNode): number {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].node == node) {
            return i;
        }
    }
    return -1;
}
