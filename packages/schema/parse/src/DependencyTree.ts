export class DependencyTree<TNodeContent> {
  private nodes: {[id: string]: TNodeContent} = {};
  private edges: {[id: string]: string[]} = {};

  addNode(id: string, content: TNodeContent) {
    this.nodes[id] = content;
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
}