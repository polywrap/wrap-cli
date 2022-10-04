import {
  intlMsg,
  AnyProjectManifest,
  AnyProjectManifestLanguage,
  CacheDirectory,
  CacheDirectoryConfig,
  loadCodegenManifest,
  defaultCodegenDir,
} from "../";

import {
  CodegenManifest,
  PolywrapManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { BindOutput } from "@polywrap/schema-bind";
import { Abi } from "@polywrap/schema-parse";
import path from "path";

export interface ProjectConfig {
  rootDir: string;
  quiet?: boolean;
  codegenManifestPath?: string;
}

export abstract class Project<TManifest extends AnyProjectManifest> {
  protected _cache: CacheDirectory;
  protected _codegenManifest: CodegenManifest | undefined;

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

  public abstract getImportAbis(): Promise<
    PolywrapManifest["source"]["import_abis"]
  >;

  public get quiet(): boolean {
    return !!this._config.quiet;
  }

  public abstract generateSchemaBindings(
    abi: Abi,
    generationSubPath?: string
  ): Promise<BindOutput>;

  /// Polywrap Codegen Manifest (polywrap.codegen.yaml)

  public async getCodegenManifestPath(): Promise<string | undefined> {
    const projectManifest = await this.getManifest();

    // If a custom codegen manifest path is configured
    if (this._config.codegenManifestPath) {
      return this._config.codegenManifestPath;
    }
    // If the project manifest specifies a custom codegen manifest
    else if (projectManifest.extensions?.codegen) {
      this._config.codegenManifestPath = path.join(
        this.getManifestDir(),
        projectManifest.extensions.codegen
      );
      return this._config.codegenManifestPath;
    }
    // No codegen manifest found
    else {
      return undefined;
    }
  }

  public async getCodegenManifestDir(): Promise<string | undefined> {
    const manifestPath = await this.getCodegenManifestPath();

    if (manifestPath) {
      return path.dirname(manifestPath);
    } else {
      return undefined;
    }
  }

  public async getCodegenManifest(): Promise<CodegenManifest | undefined> {
    if (!this._codegenManifest) {
      const manifestPath = await this.getCodegenManifestPath();

      if (manifestPath) {
        const language = await this.getManifestLanguage();
        const extensionDir = `${__dirname}/../defaults/codegen-config/${language}`;
        this._codegenManifest = await loadCodegenManifest(
          manifestPath,
          extensionDir,
          this.quiet
        );
      }
    }
    return this._codegenManifest;
  }

  protected _getGenerationDirectory(
    codegenDirAbs?: string,
    codegenManifest?: CodegenManifest
  ): string {
    return path.join(
      this.getManifestDir(),
      codegenDirAbs ?? codegenManifest?.codegenDir ?? defaultCodegenDir
    );
  }
}
