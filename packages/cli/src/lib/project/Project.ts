import { intlMsg, AnyManifest, AnyManifestLanguage } from "../";

import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import copyfiles from "copyfiles";
import { config as loadEnvVars } from "dotenv";
import { writeFileSync } from "@web3api/os-js";
import { BindOutput } from "@web3api/schema-bind";
import { ComposerOutput } from "@web3api/schema-compose";

export interface ProjectConfig {
  rootCacheDir: string;
  quiet?: boolean;
}

export abstract class Project<TManifest extends AnyManifest> {
  constructor(
    protected _config: ProjectConfig,
    protected _projectCacheSubDir: string
  ) {}

  /// Validation

  public static validateManifestLanguage(
    language: string | undefined,
    manifestLanguages: Record<string, string>,
    isManifestLanguage: (language: string) => boolean
  ): void {
    if (!language) {
      throw Error(intlMsg.lib_project_language_not_found());
    }

    if (!isManifestLanguage(language)) {
      throw Error(
        intlMsg.lib_project_invalid_manifest_language({
          language,
          validTypes: Object.keys(manifestLanguages).join(", "),
        })
      );
    }
  }

  /// Abstract Interface

  public abstract reset(): void;

  public abstract validate(): Promise<void>;

  public abstract getName(): Promise<string>;

  public abstract getManifest(): Promise<TManifest>;

  public abstract getManifestDir(): string;

  public abstract getManifestPath(): string;

  public abstract getManifestLanguage(): Promise<AnyManifestLanguage>;

  public abstract getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }>;

  public abstract getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  >;

  public abstract generateSchemaBindings(
    composerOutput: ComposerOutput,
    outputDir?: string
  ): Promise<BindOutput>;

  public get quiet(): boolean {
    return !!this._config.quiet;
  }

  /// Cache (.w3 folder)

  public getCacheDir(): string {
    return path.join(
      this._config.rootCacheDir,
      ".w3",
      this._projectCacheSubDir
    );
  }

  public resetCache(): void {
    rimraf.sync(this.getCacheDir());
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

  public loadEnvironmentVariables(
    config: Record<string, string>
  ): Record<string, string> {
    const isEnvVar = (c: string) => c.startsWith && c.startsWith("$");
    const values = Object.values(config);
    const shouldLoad = values.some(isEnvVar);

    /**
     * Modifies current config with loaded environment variables if needed
     * @param config current config, is the object that is going to be modified
     * @param currentValue value that can starts with $, if so, it is modified
     * @param index current index of object
     */
    const replaceValue = (
      config: Record<string, string>,
      currentValue: string,
      index: number
    ) => {
      if (isEnvVar(currentValue)) {
        // Remove $ from the string
        const importedVariable = currentValue.substring(1);
        if (process.env[importedVariable]) {
          // Access current object key with index, so we can modify it
          const currentKey = Object.keys(config)[index];
          config[currentKey] = process.env[importedVariable] as string;
        } else {
          throw Error(
            "Variable specified on manifest is not defined as environment variable"
          );
        }
      }
      return config;
    };

    if (shouldLoad) {
      loadEnvVars();
      return values.reduce(replaceValue, config);
    }

    return config;
  }
}
