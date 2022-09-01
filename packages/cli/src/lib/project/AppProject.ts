import { Project, ProjectConfig } from ".";
import {
  AppManifestLanguage,
  appManifestLanguages,
  isAppManifestLanguage,
  loadAppManifest,
  appManifestLanguageToBindLanguage,
} from "./manifests";

import { AppManifest } from "@polywrap/polywrap-manifest-types-js";
import { bindSchema, BindOutput } from "@polywrap/schema-bind";
import path from "path";
import { WrapAbi } from "@polywrap/wrap-manifest-types-js";

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
        this.quiet
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

  public async generateSchemaBindings(
    abi: WrapAbi,
    generationSubPath?: string
  ): Promise<BindOutput> {
    return bindSchema({
      projectName: await this.getName(),
      abi,
      outputDirAbs: this._getGenerationDirectory(generationSubPath),
      bindLanguage: appManifestLanguageToBindLanguage(
        await this.getManifestLanguage()
      ),
    });
  }

  private _getGenerationDirectory(generationSubPath = "wrap"): string {
    return path.join(this.getManifestDir(), generationSubPath);
  }
}
