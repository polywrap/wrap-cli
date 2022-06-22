import { PackageReader, PathStats } from ".";

import path from "path";
import fs from "fs";

export class FileSystemPackageReader implements PackageReader {
  constructor(public readonly wrapperPath: string) {}

  readFileAsString(filePath: string): Promise<string> {
    return fs.promises.readFile(path.join(this.wrapperPath, filePath), "utf8");
  }

  readFile(filePath: string): Promise<Buffer> {
    return fs.promises.readFile(path.join(this.wrapperPath, filePath));
  }

  exists(itemPath: string): Promise<boolean> {
    return Promise.resolve(
      fs.existsSync(path.join(this.wrapperPath, itemPath))
    );
  }

  async getStats(itemPath: string): Promise<PathStats> {
    const stat = await fs.promises.lstat(path.join(this.wrapperPath, itemPath));
    return {
      isFile: stat.isFile(),
      isDir: stat.isDirectory(),
      size: stat.size,
    };
  }

  readDir(dirPath: string): Promise<string[]> {
    return fs.promises.readdir(path.join(this.wrapperPath, dirPath));
  }
}
