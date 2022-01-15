import { Project, ProjectConfig } from "./Project";
import {
  loadPluginManifest, ManifestLanguage,
} from "../helpers";

import { PluginManifest, Uri } from "@web3api/core-js";
import path from "path";
import fs from "fs";

export interface ExternalPluginProjectConfig extends ProjectConfig {
  rootPath: string;
  uri: Uri;
  namespace: string;
  language: string;
}

export class ExternalPluginProject extends Project {
  private _pluginManifest: PluginManifest | undefined;
  private _cacheSubpath: string;
  private _cachePath: string;

  constructor(protected _config: ExternalPluginProjectConfig) {
    super(_config);
    this._cacheSubpath = `ExternalProjects/${this._config.namespace}`;
    this._cachePath = this.getCachePath(this._cacheSubpath);
  }

  /// Project Base Methods

  public reset(): void {
    this._pluginManifest = undefined;
    this.removeCacheDir(this._cacheSubpath);
  }

  public getRootDir(): string {
    return this._config.rootPath;
  }

  public async getManifestLanguage(): Promise<ManifestLanguage> {
    const language = (await this.getPluginManifest()).language;
    Project.validateManifestLanguage(language, ["plugin/"]);
    return language as ManifestLanguage;
  }

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getPluginManifest();
    const dir = this.getPluginManifestDir();
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
    const manifest = await this.getPluginManifest();
    return manifest.import_redirects || [];
  }

  /// Plugin Manifest (web3api.plugin.yaml)

  public getPluginManifestPath(): string {
    return path.join(this._cachePath, "/web3api.plugin.yaml");
  }

  public getPluginManifestDir(): string {
    return this._cachePath;
  }

  public async getPluginManifest(): Promise<PluginManifest> {
    if (!this._pluginManifest) {
      await this.createAndCachePluginManifest();
      const manifestPath: string = this.getPluginManifestPath();
      this._pluginManifest = await loadPluginManifest(manifestPath, this.quiet);
    }

    return Promise.resolve(this._pluginManifest);
  }

  /// Support Functions

  private async createCacheDir(): Promise<void> {
    if (!fs.existsSync(this._cachePath)) {
      fs.mkdirSync(this._cachePath, { recursive: true });
    }
  }

  private async createAndCachePluginManifest(): Promise<void> {
    const lang: string = this._config.language.replace("dapp/", "plugin/");
    const manifestDir: string = this.getPluginManifestDir();
    const pluginDir: string = this._config.uri.path;
    const manifestToSchema: string = path.relative(manifestDir, pluginDir);
    const schemaPath: string = path.join(manifestToSchema, "./schema.graphql");
    const manifest: string = `
format: 0.0.1-prealpha.1
language: ${lang}
schema: ${schemaPath}
`.trim();
    const manifestPath = path.join(manifestDir, "web3api.plugin.yaml");
    await this.createCacheDir();
    await fs.promises.writeFile(manifestPath, manifest);
  }
}
