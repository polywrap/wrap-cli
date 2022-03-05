/* eslint-disable @typescript-eslint/naming-convention */

import { ImportedProject } from "./";
import { ProjectConfig } from "../";
import { ManifestLanguage, outputManifest } from "../../";

import {
  Web3ApiManifest,
  Client,
  Uri
} from "@web3api/core-js";
import path from "path";

const cacheLayout = {
  root: (namespace: string) => `imports/web3apis/${namespace}`,
  manifestFile: "web3api.json",
  schemaFile: "schema.graphql",
};

export interface ImportedWeb3ApiProjectConfig extends ProjectConfig {
  uri: Uri;
  namespace: string;
  client: Client;
}

export class ImportedWeb3ApiProject extends ImportedProject<Web3ApiManifest> {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _web3apiSchema: string | undefined;

  constructor(protected _config: ImportedWeb3ApiProjectConfig) {
    super(_config, cacheLayout.root(_config.namespace));
  }

  /// Project Base Methods

  public reset(): void {
    this._web3apiManifest = undefined;
    this.resetCache();
  }

  public async validate(): Promise<void> {
    return Promise.resolve();
  }

  /// Manifest (web3api.yaml)

  public async getManifest(): Promise<Web3ApiManifest> {
    if (!this._web3apiManifest) {
      const client: Client = this._config.client;
      const uri: Uri = this._config.uri;
      this._web3apiManifest = await client.getManifest(uri, {
        type: "web3api",
      });
      outputManifest(
        this._web3apiManifest,
        this.getManifestPath(),
        this._config.quiet
      );
    }

    return Promise.resolve(this._web3apiManifest);
  }

  public getManifestDir(): string {
    return path.dirname(this.getManifestPath());
  }

  public getManifestPath(): string {
    return this.getCachePath(cacheLayout.manifestFile);
  }

  public async getManifestLanguage(): Promise<ManifestLanguage> {
    const language = (await this.getManifest()).language;

    ImportedWeb3ApiProject.validateManifestLanguage(
      language,
      ["wasm/", "interface/"]
    );

    return language as ManifestLanguage;
  }

  /// ProjectWithSchema Base Methods

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    if (!this._web3apiSchema) {
      const client: Client = this._config.client;
      const uri: Uri = this._config.uri;
      const schema: string = await client.getSchema(uri, {});
      this.writeCacheFile(cacheLayout.schemaFile, schema, "utf-8");
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
