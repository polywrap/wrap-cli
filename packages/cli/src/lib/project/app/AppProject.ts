import {
  ImportedWeb3ApiProject,
  ImportedPluginProject
} from "./";
import { ProjectWithSchema, ProjectConfig } from "../";
import {
  AppManifestLanguage,
  appManifestLanguages,
  isAppManifestLanguage,
  loadAppManifest,
} from "../../";

import { AppManifest, Client, Uri } from "@web3api/core-js";
import path from "path";

const cacheLayout = {
  root: "app"
};

export interface AppProjectConfig extends ProjectConfig {
  appManifestPath: string;
  client: Client;
}

export class AppProject extends ProjectWithSchema<AppManifest> {
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
    ProjectWithSchema.validateManifestLanguage(
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

    ProjectWithSchema.validateManifestLanguage(
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
    const namedPaths: { [name: string]: string } = {};

    // Aggregate all dependencies into a schema
    const web3apis = manifest.dependencies?.web3apis || [];
    const plugins = manifest.dependencies?.plugins || [];
    const importStatements: string[] = [];

    for (const web3api of web3apis) {
      importStatements.push(
        `#import * into ${web3api.namespace} from "${web3api.uri}"`
      );
    }

    for (const plugin of plugins) {
      importStatements.push(
        `#import * into ${plugin.namespace} from "${plugin.uri}"`
      );
    }

    this.writeCacheFile(
      "schema.graphql",
      importStatements.join("\n"),
      "utf-8"
    );

    namedPaths["combined"] = this.getCachePath("schema.graphql");
    return namedPaths;
  }

  public async getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  > {
    const manifest = await this.getManifest();
    const plugins = manifest.dependencies?.plugins || [];
    const import_redirects = plugins.map((plugin) => ({
      uri: plugin.uri,
      schema: plugin.schema,
    }));
    return import_redirects;
  }

  public async getImportedDependencies(): Promise<
    (ImportedPluginProject | ImportedWeb3ApiProject)[]
  > {
    const manifest = await this.getManifest();

    if (!manifest.dependencies) {
      return [];
    }

    const plugins = manifest.dependencies.plugins || [];
    const web3apis = manifest.dependencies.web3apis || [];
    const imports: (ImportedPluginProject | ImportedWeb3ApiProject)[] = [];

    for (const plugin of plugins) {
      const importedPlugin = new ImportedPluginProject({
        rootCacheDir: this._config.rootCacheDir,
        pluginManifestPath: plugin.schema,
        namespace: plugin.namespace
      });
      await importedPlugin.validate();
      imports.push(importedPlugin);
    }

    for (const web3api of web3apis) {
      const importedWeb3Api = new ImportedWeb3ApiProject({
        rootCacheDir: this._config.rootCacheDir,
        uri: new Uri(web3api.uri),
        namespace: web3api.namespace,
        client: this._config.client
      });
      await importedWeb3Api.validate();
      imports.push(importedWeb3Api);
    }

    return imports;
  }
}
