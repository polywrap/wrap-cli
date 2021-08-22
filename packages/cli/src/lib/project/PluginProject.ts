import { Project, ProjectConfig } from "./Project";
import {
  loadPluginManifest,
  manifestLanguageToTargetLanguage,
} from "../helpers";

import { PluginManifest } from "@web3api/core-js";
import { TargetLanguage } from "@web3api/schema-bind";
import path from "path";

export interface PluginProjectConfig extends ProjectConfig {
  pluginManifestPath: string;
}

export class PluginProject extends Project {
  private _pluginManifest: PluginManifest | undefined;

  constructor(protected _config: PluginProjectConfig) {
    super(_config);
  }

  /// Project Base Methods

  public reset(): void {
    this._pluginManifest = undefined;
  }

  public getRootDir(): string {
    return this.getPluginManifestDir();
  }

  public async getLanguage(): Promise<TargetLanguage> {
    const language = (await this.getPluginManifest()).language;
    return manifestLanguageToTargetLanguage(language);
  }

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getPluginManifest();
    const dir = this.getPluginManifestDir();
    const namedPaths: { [name: string]: string } = {};

    namedPaths["combined"] = path.join(dir, manifest.schema);
    loadPluginManifest;
    return namedPaths;
  }

  public async getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  > {
    const manifest = await this.getPluginManifest();
    return manifest.import_redirects || [];
  }

  /// Plugin Manifest (web3api.plugin.yaml)

  public getPluginManifestPath(): string {
    return this._config.pluginManifestPath;
  }

  public getPluginManifestDir(): string {
    return path.dirname(this._config.pluginManifestPath);
  }

  public async getPluginManifest(): Promise<PluginManifest> {
    if (!this._pluginManifest) {
      this._pluginManifest = await loadPluginManifest(
        this.getPluginManifestPath(),
        this.quiet
      );
    }

    return Promise.resolve(this._pluginManifest);
  }
}
