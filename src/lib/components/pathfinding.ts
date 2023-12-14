import {
    getStart, setTile,
    type GridNode, Tile, getEnd, getNeighbours, setParent
} from "./graph";

export enum Algorithm {
    BFS,
};

export function run(algo: Algorithm): Array<GridNode> {
    let search: Array<GridNode> = [];
    switch (algo) {
        case Algorithm.BFS:
            search = bfs();
            break;
    }

    return search;
}

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

function inArray(arr: Array<GridNode>, node: GridNode) {
    for (let vNode of arr) {
        if (vNode.xy.x === node.xy.x && vNode.xy.y === node.xy.y) {
            return true;
        }
    }
    return false;
}
