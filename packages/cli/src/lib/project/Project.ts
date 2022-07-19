import {
  intlMsg,
  AnyProjectManifest,
  AnyProjectManifestLanguage,
  CacheDirectory,
  CacheDirectoryConfig,
} from "../";

import { BindOutput } from "@polywrap/schema-bind";
import { Abi } from "@polywrap/schema-parse";

export interface ProjectConfig {
  rootDir: string;
  quiet?: boolean;
}

export abstract class Project<TManifest extends AnyProjectManifest> {
  protected _cache: CacheDirectory;

  constructor(protected _config: ProjectConfig, _cache: CacheDirectoryConfig) {
    this._cache = new CacheDirectory(_cache);
  }

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

  public abstract getManifestLanguage(): Promise<AnyProjectManifestLanguage>;

  public abstract getSchemaNamedPath(): Promise<string>;

  public abstract getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  >;

  public abstract generateSchemaBindings(
    abi: Abi,
    generationSubPath?: string
  ): Promise<BindOutput>;

  public get quiet(): boolean {
    return !!this._config.quiet;
  }
}
