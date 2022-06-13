import { PathStats } from "./PathStats";

export type WrapperReadOperations = {
  readFileAsString: (path: string) => string;
  readFile: (path: string) => Buffer;
  exists: (path: string) => boolean;
  getStats: (path: string) => PathStats;
  readDir: (path: string) => Iterable<string>;
};
