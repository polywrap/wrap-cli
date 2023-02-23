export class DependencyTree {
  private nodes: {[id: string]: undefined} = {};
  private edges: {[id: string]: string[]} = {};

  addNode(id: string) {
    this.nodes[id] = undefined;
    this.edges[id] = [];
  }

  addEdge(from: string, to: string) {
    this.edges[from].push(to);
  }

  hasNode(nodeId: string) {
    return this.nodes.hasOwnProperty(nodeId);
  }

  getNodeProperties(nodeId: string) {
    return this.nodes[nodeId];
  }

  getNodeDependencies(nodeId: string) {
    return this.edges[nodeId];
  }

  getAllDependencies(nodeIds: string[]): string[] {
    const visited = new Set<string>();
    const queue = [...nodeIds];
    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (nodeId && !visited.has(nodeId)) {
        visited.add(nodeId);
        const dependencies = this.getNodeDependencies(nodeId);
        queue.push(...dependencies);
      }
    }
    return Array.from(visited);
  }

  getRootNodes(): string[] {
    const allNodes = Object.keys(this.nodes);
    const dependentNodes = new Set<string>();
    for (const from in this.edges) {
      const toNodes = this.edges[from];
      for (const to of toNodes) {
        dependentNodes.add(to);
      }
    }
    const rootNodes = allNodes.filter(nodeId => !dependentNodes.has(nodeId));
    return rootNodes;
  }

  printVisualTree(rootNodeId: string, prefix = '', isLast = true, output = ''): string {
    const branchChar = isLast ? '└── ' : '├── ';
    const currentNode = `${prefix}${branchChar}${rootNodeId}\n`;
    output += currentNode;
    const dependencies = this.getNodeDependencies(rootNodeId);
    const numDeps = dependencies.length;
    for (let i = 0; i < numDeps; i++) {
      const depNodeId = dependencies[i];
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      const isLastDep = i === numDeps - 1;
      output = this.printVisualTree(depNodeId, newPrefix, isLastDep, output);
    }
    return output;
  }

  findCircularDependencies(): { detected: true; cycle: string; } | { detected: false } {
    const visited = new Set<string>();
    const inStack = new Set<string>();
    const cycle: string[] = [];
  
    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      inStack.add(nodeId);
      const dependencies = this.getNodeDependencies(nodeId);
      for (const depNodeId of dependencies) {
        if (!visited.has(depNodeId)) {
          dfs(depNodeId);
        } else if (inStack.has(depNodeId)) {
          cycle.unshift(depNodeId);
          cycle.unshift(nodeId);
          return;
        }
      }
      inStack.delete(nodeId);
    };
  
    for (const nodeId in this.nodes) {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
        if (cycle.length > 0) {
          break;
        }
      }
    }
  
    if (cycle.length > 0) {
      const cycleStart = cycle[0];
      const cycleEnd = cycle[cycle.length - 1];
      const cycleIndex = cycle.indexOf(cycleStart);
      const cycleLength = cycle.length - cycleIndex;
      const cycleSlice = cycle.slice(cycleIndex, cycleIndex + cycleLength);
      const cycleString = cycleSlice.join(' -> ');
      return {
        detected: true,
        cycle: `Circular dependency detected: ${cycleString} -> ${cycleEnd}`
      };
    } else {
      return {
        detected: false,
      };
    }
  }
}