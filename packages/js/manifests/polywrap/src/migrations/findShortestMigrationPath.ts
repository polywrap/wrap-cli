import { Migrator } from "./Migrator";

type MigrationWithSearchHistory = [Migrator, Migrator[]];

// A simple BFS intended to find the shortest migration path from one version to another
// Returns an array of migrations in the order they need to be performed to migrate from one version to another
export function findShortestMigrationPath(
  nodes: Migrator[],
  from: string,
  to: string
): Migrator[] | undefined {
  if (from === to) {
    return [];
  }

  const possibleStarts = nodes.filter((x) => x.from === from);

  if (!possibleStarts.length) {
    return undefined;
  }

  const visited = [...possibleStarts];

  const queue: MigrationWithSearchHistory[] = possibleStarts.map((start) => [
    start,
    [start],
  ]);

  while (queue.length) {
    const [node, path] = queue.shift() as MigrationWithSearchHistory;

    if (node.to === to) {
      return path;
    }

    const neighbours = nodes.filter(
      (x) => !visited.includes(x) && x.from === node.to
    );

    for (const neighbour of neighbours) {
      visited.push(neighbour);

      if (neighbour.to === to) {
        return [...path, neighbour];
      }

      queue.push([neighbour, [...path, neighbour]]);
    }
  }

  return undefined;
}
