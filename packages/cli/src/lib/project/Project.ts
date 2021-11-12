import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import copyfiles from "copyfiles";
import { TargetLanguage } from "@web3api/schema-bind";

export interface ProjectConfig {
  quiet?: boolean;
}

export abstract class Project {
  constructor(protected _config: ProjectConfig) {}

  /// Abstract Interface
  public abstract reset(): void;

  public abstract getRootDir(): string;

  public abstract getLanguage(): Promise<TargetLanguage>;

  public abstract getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }>;

  public abstract getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  >;

  public get quiet(): boolean {
    return !!this._config.quiet;
  }

  /// Cache (.w3 folder)

  public getCacheDir(): string {
    return path.join(this.getRootDir(), ".w3");
  }

  public readCacheFile(file: string): string | undefined {
    const filePath = path.join(this.getCacheDir(), file);

    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    return fs.readFileSync(filePath, "utf-8");
  }

  public removeCacheDir(subfolder: string): void {
    const folderPath = path.join(this.getCacheDir(), subfolder);
    rimraf.sync(folderPath);
  }

  public getCachePath(subpath: string): string {
    return path.join(this.getCacheDir(), subpath);
  }

  public async copyFilesIntoCache(
    destSubfolder: string,
    sourceFolder: string,
    options: copyfiles.Options = {}
  ): Promise<void> {
    const dest = this.getCachePath(destSubfolder);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    await new Promise<void>((resolve, reject) => {
      copyfiles([sourceFolder, dest], options, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
