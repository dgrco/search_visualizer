import type { GridNode } from "./graph";

// A type including the node itself, gCost and hCost
export type SearchNode = {
    node: GridNode,
    gCost: number,
    hCost: number,
    fCost: number,
}

export default class PriorityQueue {
    data: Array<SearchNode>;

    constructor() {
        this.data = [];
    }

    // enqueues a node `x` into the priority queue
    // gCost is the current path cost to x
    // hCost is the heuristic cost from x to the end node
    enqueue(x: GridNode, gCost: number, hCost: number) {
        let searchNode: SearchNode = { node: x, gCost, hCost, fCost: gCost + hCost };

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].fCost >= (gCost + hCost)) {
                // splice by deleting 0 elements => an insert at index i
                this.data.splice(i, 0, searchNode);
                return;
            }
        }

        this.data.push(searchNode);
    }

    // dequeues the node with the smallest priority (key)
    dequeue(): SearchNode | undefined {
        if (this.data.length == 0) {
            console.log("Cannot dequeue from an empty queue");
            return;
        } 

        return this.data.shift();
    }

    // returns true if the queue is empty, false otherwise
    isEmpty(): boolean {
        return this.data.length === 0;
    }

    // decreases the priority value
    decreaseKey(sNode: SearchNode, gCost: number, hCost: number): boolean {
        if (sNode.fCost <= gCost + hCost) return false;

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] == sNode) {
                let foundNode = this.data.splice(i, 1)[0];
                foundNode.fCost = gCost + hCost;
                this.enqueue(foundNode.node, gCost, hCost);
                return true;
            }
        }
        return false;
    }

    // returns the inner data array
    getData() {
        return this.data;
    }
}
