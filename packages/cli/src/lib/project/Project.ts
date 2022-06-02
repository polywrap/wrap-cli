import { intlMsg, AnyManifest, AnyManifestLanguage } from "../";

import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import copyfiles from "copyfiles";
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

  public static loadEnvironmentVariables(
    obj: Record<string, unknown>
  ): Record<string, unknown> {
    const entries = Object.entries(obj);
    const isEnvVar = (c: string) => c.startsWith && c.startsWith("$");

    const loadVar = (value: unknown) => {
      if (typeof value === "string" && isEnvVar(value)) {
        return Project.getEnvironmentVariable(value);
      }
      return value;
    };

    const isObject = (val: unknown): boolean => {
      if (val === null) {
        return false;
      }
      return typeof val === "object";
    };

    const iterateArray = (value: unknown[]): unknown => {
      return value.map((v) => {
        if (Array.isArray(v)) return iterateArray(v);

        if (isObject(v)) {
          return Object.entries(v as Record<string, unknown>).reduce(
            replaceValue,
            v
          );
        }

        return loadVar(v);
      });
    };

    /**
     * Modifies current config with loaded environment variables if needed
     * @param object can be any object that we would like to update environment variables
     * @param key key of current object. this will allow to update it
     * @param value value of current object, we check if it is object or array,
     * if so, we need to iterate again, otherwise just check if it is an
     * env var and update if is true
     */
    const replaceValue = (
      object: Record<string, unknown>,
      [key, value]: [string, unknown]
    ) => {
      if (Array.isArray(value)) {
        object[key] = iterateArray(value);
        return object;
      }

      if (isObject(value)) {
        const newValues = Object.entries(value as Record<string, unknown>);
        object[key] = newValues.reduce(replaceValue, value);
        return object;
      }

      object[key] = loadVar(value);
      return object;
    };

    return entries.reduce(replaceValue, obj);
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
    generationSubPath?: string
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

  private static getEnvironmentVariable(value: string): string {
    const importedVariable = value.substring(1);
    if (process.env[importedVariable]) {
      return process.env[importedVariable] as string;
    } else {
      throw new Error(
        intlMsg.lib_project_env_var_not_found({
          variableName: importedVariable,
        })
      );
    }
  }
}
