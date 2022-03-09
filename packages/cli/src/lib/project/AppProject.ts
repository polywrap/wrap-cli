import { Project, ProjectConfig } from ".";
import {
  AppManifestLanguage,
  appManifestLanguages,
  isAppManifestLanguage,
  loadAppManifest,
} from "..";

import { AppManifest, Client } from "@web3api/core-js";
import path from "path";

const cacheLayout = {
  root: "app",
};

export interface AppProjectConfig extends ProjectConfig {
  appManifestPath: string;
  client: Client;
}

export class AppProject extends Project<AppManifest> {
  private _appManifest: AppManifest | undefined;

  constructor(protected _config: AppProjectConfig) {
    super(_config, cacheLayout.root);
  }

  /// Project Based Methods

  public reset(): void {
    this._appManifest = undefined;
    this.resetCache();
  }

  public async validate(): Promise<void> {
    const manifest = await this.getManifest();

    // Validate language
    Project.validateManifestLanguage(
      manifest.language,
      appManifestLanguages,
      isAppManifestLanguage
    );
  }

  /// Manifest (web3api.app.yaml)

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
    const language = (await this.getManifest()).language;

    Project.validateManifestLanguage(
      language,
      appManifestLanguages,
      isAppManifestLanguage
    );

    return language as AppManifestLanguage;
  }

  /// ProjectWithSchema Base Methods

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
    const namedPaths: { [name: string]: string } = {};

    namedPaths["combined"] = path.join(dir, manifest.schema);
    return namedPaths;
  }

  public async getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  > {
    const manifest = await this.getManifest();
    return manifest.import_redirects || [];
  }
}
