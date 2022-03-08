import {
  ProjectConfig,
  ProjectWithSchema
} from "../";
import {
  loadPluginManifest,
  PluginManifestLanguage,
  pluginManifestLanguages,
  isPluginManifestLanguage,
} from "../../";

import { PluginManifest } from "@web3api/core-js";
import path from "path";

const cacheLayout = {
  root: "plugin"
};

export interface PluginProjectConfig extends ProjectConfig {
  pluginManifestPath: string;
}

export class PluginProject extends ProjectWithSchema<PluginManifest> {
  private _pluginManifest: PluginManifest | undefined;

  constructor(protected _config: PluginProjectConfig) {
    super(_config, cacheLayout.root);
  }

  /// Project Base Methods

  public reset(): void {
    this._pluginManifest = undefined;
    this.resetCache();
  }

  public async validate(): Promise<void> {
    return Promise.resolve();
  }

  /// Manifest (web3api.plugin.yaml)

  public async getManifest(): Promise<PluginManifest> {
    if (!this._pluginManifest) {
      this._pluginManifest = await loadPluginManifest(
        this.getManifestPath(),
        this.quiet
      );
    }

    return Promise.resolve(this._pluginManifest);
  }

  public getManifestDir(): string {
    return path.dirname(this._config.pluginManifestPath);
  }

  public getManifestPath(): string {
    return this._config.pluginManifestPath;
  }

  public async getManifestLanguage(): Promise<PluginManifestLanguage> {
    const language = (await this.getManifest()).language;

    ProjectWithSchema.validateManifestLanguage(
      language,
      pluginManifestLanguages,
      isPluginManifestLanguage
    );

    return language as PluginManifestLanguage;
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
