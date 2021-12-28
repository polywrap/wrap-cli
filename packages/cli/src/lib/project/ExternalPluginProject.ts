import { Project, ProjectConfig } from "./Project";
import {
  loadPluginManifest,
  manifestLanguageToTargetLanguage,
} from "../helpers";

import { PluginManifest, Uri } from "@web3api/core-js";
import { TargetLanguage } from "@web3api/schema-bind";
import path from "path";
import fs from "fs";
import { intlMsg } from "../intl";

export interface ExternalPluginProjectConfig extends ProjectConfig {
  rootPath: string;
  uri: string;
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
    const pluginDir: string = this.sanitizeExternalPluginUri(
      this._config.uri
    );
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

  private sanitizeExternalPluginUri(uri: string): string {
    let result: Uri;
    try {
      result = new Uri(uri);
    } catch (e) {
      if (!fs.existsSync(uri)) {
        throw e;
      }
      result = new Uri(`fs/${uri}`);
    }
    if (result.authority !== "fs") {
      throw Error(
        `${intlMsg.lib_project_plugin_uri_support()}\n` +
        `w3://fs/./node_modules/myPlugin/\n` +
        `fs/./node_modules/myPlugin/\n` +
        `./node_modules/myPlugin/\n\n` +
        `${intlMsg.lib_project_invalid_uri()}: ${uri}`
      );
    }
    return path.resolve(result.path);
  }
}

