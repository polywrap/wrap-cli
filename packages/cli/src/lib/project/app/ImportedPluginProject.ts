import { ImportedProject } from "./";
import { ProjectConfig } from "../";
import {
  loadPluginManifest,
  outputManifest,
  ManifestLanguage,
  intlMsg
} from "../../";

import {
  PluginManifest,
} from "@web3api/core-js";
import path from "path";
import fs from "fs";

const cacheLayout = {
  root: (namespace: string) => `imports/plugins/${namespace}`,
  manifestFile: "web3api.plugin.json",
  schemaFile: "schema.graphql",
};

export interface ImportedPluginProjectConfig extends ProjectConfig {
  pluginManifestPath: string;
  namespace: string;
}

export class ImportedPluginProject extends ImportedProject<PluginManifest> {
  private _pluginManifest: PluginManifest | undefined;
  private _pluginSchema: string | undefined;

  constructor(protected _config: ImportedPluginProjectConfig) {
    super(_config, cacheLayout.root(_config.namespace));
  }

  /// Project Base Methods

  public reset(): void {
    this._pluginManifest = undefined;
    this._pluginSchema = undefined;
    this.resetCache();
  }

  public async validate(): Promise<void> {
    if (!fs.existsSync(this._config.pluginManifestPath)) {
      throw Error(
        intlMsg.lib_project_imported_plugin_manifest_not_found({
          namespace: this._config.namespace,
          path: this._config.pluginManifestPath
        })
      );
    }
    return Promise.resolve();
  }

  /// Manifest (web3api.plugin.yaml)

  public async getManifest(): Promise<PluginManifest> {
    if (!this._pluginManifest) {
      this._pluginManifest = await loadPluginManifest(
        this._config.pluginManifestPath,
        this.quiet
      );
      this._pluginManifest.schema = "./" + cacheLayout.schemaFile;
      outputManifest(
        this._pluginManifest,
        this.getManifestPath(),
        this._config.quiet
      );
    }

    return Promise.resolve(this._pluginManifest);
  }

  public getManifestDir(): string {
    return path.dirname(this.getManifestPath());
  }

  public getManifestPath(): string {
    return this.getCachePath(cacheLayout.manifestFile);
  }

  public async getManifestLanguage(): Promise<ManifestLanguage> {
    const language = (await this.getManifest()).language;

    ImportedPluginProject.validateManifestLanguage(
      language,
      ["plugin/"]
    );

    return language as ManifestLanguage;
  }

  /// ProjectWithSchema Base Methods

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    if (!this._pluginSchema) {
      const manifest = await this.getManifest();
      const schemaPath = path.join(
        path.dirname(this._config.pluginManifestPath),
        manifest.schema
      );
      this._pluginSchema = fs.readFileSync(
        schemaPath, "utf-8"
      );
      this.writeCacheFile(
        cacheLayout.schemaFile,
        this._pluginSchema,
        "utf-8"
      );
    }

    return {
      composed: this.getCachePath(cacheLayout.schemaFile)
    };
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

  /// ImportedProject Base Methods

  public getNamespace(): string {
    return this._config.namespace;
  }
}
