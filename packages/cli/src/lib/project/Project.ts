import { intlMsg } from "../intl";
import {
  ManifestLanguage,
  isManifestLanguage,
  manifestLanguages,
} from "../helpers";

import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import copyfiles from "copyfiles";
import { writeFileSync } from "@web3api/os-js";

export interface ProjectConfig {
  quiet?: boolean;
}

export abstract class Project {
  constructor(protected _config: ProjectConfig) {}

  /// Abstract Interface
  public abstract reset(): void;

  public abstract getRootDir(): string;

  public abstract getManifestLanguage(): Promise<ManifestLanguage>;

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

  public removeCacheDir(subfolder: string): void {
    const folderPath = path.join(this.getCacheDir(), subfolder);
    rimraf.sync(folderPath);
  }

  public getCachePath(subpath: string): string {
    return path.join(this.getCacheDir(), subpath);
  }

  public readCacheFile(file: string): string | undefined {
    const filePath = this.getCachePath(file);

    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    return fs.readFileSync(filePath, "utf-8");
  }

  public writeCacheFile(
    subPath: string,
    data: unknown,
    options?: fs.WriteFileOptions
  ): void {
    const filePath = this.getCachePath(subPath);
    const folderPath = path.dirname(filePath);

    // Create folders if they don't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    writeFileSync(filePath, data, options);
  }

  public async copyIntoCache(
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

  /// Validation

  protected validateManifestLanguage(
    language: string | undefined,
    validPatterns: string[]
  ): void {
    if (!language) {
      throw Error(intlMsg.lib_project_language_not_found());
    }

    const languagePatternValid = (test: string) =>
      validPatterns.some((x) => test.indexOf(x) > -1);

    if (!isManifestLanguage(language) || !languagePatternValid(language)) {
      throw Error(
        intlMsg.lib_project_invalid_manifest_language({
          language,
          validTypes: Object.keys(manifestLanguages)
            .filter((x) => languagePatternValid(x))
            .join(" | "),
        })
      );
    }
  }
}
