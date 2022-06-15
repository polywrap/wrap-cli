import { PathStats } from "./PathStats";

export interface PackageReader {
  readFileAsString: (path: string) => Promise<string>;
  readFile: (path: string) => Promise<Buffer>;
  exists: (path: string) => Promise<boolean>;
  getStats: (path: string) => Promise<PathStats>;
  readDir: (path: string) => Promise<string[]>;
}
