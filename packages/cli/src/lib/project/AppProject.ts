import { Project, ProjectConfig } from ".";
import {
  AppManifestLanguage,
  appManifestLanguages,
  isAppManifestLanguage,
  loadAppManifest,
  appManifestLanguageToBindLanguage,
} from "./manifests";

import { AppManifest } from "@polywrap/polywrap-manifest-types-js";
import {
  bindSchema,
  BindOutput,
  BindOptions,
  bindLanguageToWrapInfoType,
} from "@polywrap/schema-bind";
import path from "path";
import {
  latestWrapManifestVersion,
  WrapAbi,
} from "@polywrap/wrap-manifest-types-js";

export interface AppProjectConfig extends ProjectConfig {
  appManifestPath: string;
}

export class AppProject extends Project<AppManifest> {
  private _appManifest: AppManifest | undefined;

  public static cacheLayout = {
    root: "app",
  };

  constructor(protected _config: AppProjectConfig) {
    super(_config, {
      rootDir: _config.rootDir,
      subDir: AppProject.cacheLayout.root,
    });
  }

  /// Project Based Methods

  public reset(): void {
    this._appManifest = undefined;
    this._cache.resetCache();
  }

  public async validate(): Promise<void> {
    const manifest = await this.getManifest();

    // Validate language
    Project.validateManifestLanguage(
      manifest.project.type,
      appManifestLanguages,
      isAppManifestLanguage
    );
  }

  /// Manifest (polywrap.app.yaml)

  public async getName(): Promise<string> {
    return (await this.getManifest()).project.name;
  }

  public async getManifest(): Promise<AppManifest> {
    if (!this._appManifest) {
      this._appManifest = await loadAppManifest(
        this.getManifestPath(),
        this.logger
      );
    }

    return Promise.resolve(this._appManifest);
  }

  public getManifestDir(): string {
    return path.dirname(this._config.appManifestPath);
  }

  public getManifestPath(): string {
    return this._config.appManifestPath;
  }

  public async getManifestLanguage(): Promise<AppManifestLanguage> {
    const language = (await this.getManifest()).project.type;

    Project.validateManifestLanguage(
      language,
      appManifestLanguages,
      isAppManifestLanguage
    );

    return language as AppManifestLanguage;
  }

  /// Schema
  public async getSchemaNamedPath(): Promise<string> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
    return path.join(dir, manifest.source.schema);
  }

  public async getImportAbis(): Promise<AppManifest["source"]["import_abis"]> {
    const manifest = await this.getManifest();
    return manifest.source.import_abis || [];
  }

  public async getGenerationDirectory(
    generationSubPath?: string
  ): Promise<string> {
    return this._getGenerationDirectory(generationSubPath);
  }

  public async generateSchemaBindings(
    abi: WrapAbi,
    generationSubPath?: string,
    bindgenUri?: string,
    bindConfig?: Record<string, unknown>
  ): Promise<BindOutput> {
    const bindLanguage = appManifestLanguageToBindLanguage(
      await this.getManifestLanguage()
    );
    const codegenDir =
      generationSubPath || (bindConfig?.codegenDir as string | undefined);
    const options: BindOptions = {
      bindLanguage,
      wrapInfo: {
        version: latestWrapManifestVersion,
        name: await this.getName(),
        type: bindLanguageToWrapInfoType(bindLanguage),
        abi,
      },
      outputDirAbs: await this.getGenerationDirectory(codegenDir),
    };
    return bindSchema(options, bindgenUri);
  }

  private _getGenerationDirectory(
    useDefinedPath: string | undefined,
    defaultDir = "./src/wrap"
  ): string {
    const genPath =
      // 1. Use what the user has specified
      useDefinedPath ||
      // 2. Use the default
      defaultDir;

    if (path.isAbsolute(genPath)) {
      return genPath;
    } else {
      return path.join(this.getManifestDir(), genPath);
    }
  }
}
