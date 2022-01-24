import { Project, ProjectConfig } from "./Project";
import { loadMetaManifest, loadPluginManifest, ManifestLanguage } from "../helpers";

import { Manifest, MetaManifest, PluginManifest } from "@web3api/core-js";
import path from "path";

export interface PluginProjectConfig extends ProjectConfig {
  pluginManifestPath: string;
  metaManifestPath?: string;
}

export class PluginProject extends Project {
  private _pluginManifest: PluginManifest | undefined;
  private _metaManifest: MetaManifest | undefined;

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

  public async getManifestLanguage(): Promise<ManifestLanguage> {
    const language = (await this.getPluginManifest()).language;

    this.validateManifestLanguage(language, ["plugin/"]);

    return language as ManifestLanguage;
  }

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getPluginManifest();
    const dir = this.getPluginManifestDir();
    const namedPaths: { [name: string]: string } = {};

    if (manifest.modules.mutation) {
      namedPaths["mutation"] = path.join(dir, manifest.entrypoint, manifest.modules.mutation.schema);
    }

    if (manifest.modules.query) {
      namedPaths["query"] = path.join(dir, manifest.entrypoint, manifest.modules.query.schema);
    }

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
    return path.dirname(this.getPluginManifestPath());
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

  public async getManifest<TManifest extends Manifest>(): Promise<TManifest> {
    const manifest = await this.getPluginManifest();
    return manifest as unknown as TManifest;
  }

  public async getMetaManifest(): Promise<MetaManifest | undefined> {
    if (!this._metaManifest) {
      const manifestPath = await this.getMetaManifestPath();

      if (manifestPath) {
        this._metaManifest = await loadMetaManifest(manifestPath, this.quiet);
      }
    }
    return this._metaManifest;
  }

  public async getMetaManifestPath(): Promise<string | undefined> {
    const pluginManifest = await this.getPluginManifest();

    // If a custom meta manifest path is configured
    if (this._config.metaManifestPath) {
      return this._config.metaManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom meta manifest
    else if (pluginManifest.meta) {
      this._config.metaManifestPath = path.join(
        this.getPluginManifestDir(),
        pluginManifest.meta
      );
      return this._config.metaManifestPath;
    }
    // No meta manifest found
    else {
      return undefined;
    }
  }
}
