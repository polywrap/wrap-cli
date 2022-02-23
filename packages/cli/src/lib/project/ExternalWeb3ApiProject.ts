/* eslint-disable @typescript-eslint/naming-convention */

import { Project, ProjectConfig } from "./Project";
import { ManifestLanguage } from "../helpers";

import {
  Web3ApiManifest,
  BuildManifest,
  MetaManifest,
  Client,
  Uri,
} from "@web3api/core-js";
import path from "path";
import fs from "fs";

export interface ExternalWeb3ApiProjectConfig extends ProjectConfig {
  rootPath: string;
  uri: Uri;
  namespace: string;
  client: Client;
}

export class ExternalWeb3ApiProject extends Project {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _metaManifest: MetaManifest | undefined;
  private _cacheSubpath: string;
  private _cachePath: string;

  constructor(protected _config: ExternalWeb3ApiProjectConfig) {
    super(_config);
    this._cacheSubpath = `codegen/ExternalProjects/${this._config.namespace}`;
    this._cachePath = this.getCachePath(this._cacheSubpath);
  }

  public async getManifestPaths(absolute = false): Promise<string[]> {
    const web3apiManifestPath = this.getWeb3ApiManifestPath();
    const root = path.dirname(web3apiManifestPath);
    const paths = [
      absolute ? web3apiManifestPath : path.relative(root, web3apiManifestPath),
      absolute
        ? await this.getBuildManifestPath()
        : path.relative(root, await this.getBuildManifestPath()),
    ];

    const metaManifestPath = await this.getMetaManifestPath();

    if (metaManifestPath) {
      paths.push(
        absolute ? metaManifestPath : path.relative(root, metaManifestPath)
      );
    }

    return paths;
  }

  /// Project Base Methods

  public reset(): void {
    this._web3apiManifest = undefined;
    this._buildManifest = undefined;
    this._metaManifest = undefined;
    this.removeCacheDir(this._cacheSubpath);
  }

  public getRootDir(): string {
    return this._config.rootPath;
  }

  public async getManifestLanguage(): Promise<ManifestLanguage> {
    const language = (await this.getWeb3ApiManifest()).language;
    Project.validateManifestLanguage(language, ["wasm/", "interface"]);
    return language as ManifestLanguage;
  }

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getWeb3ApiManifest();
    const dir = this.getWeb3ApiManifestDir();
    const namedPaths: { [name: string]: string } = {};

    if (manifest.modules.query) {
      namedPaths["composed"] = path.join(dir, manifest.modules.query.schema);
    } else if (manifest.modules.mutation) {
      namedPaths["composed"] = path.join(dir, manifest.modules.mutation.schema);
    }

    await this.fetchAndCacheSchema();
    return namedPaths;
  }

  public async getImportRedirects(): Promise<
    {
      uri: string;
      schema: string;
    }[]
  > {
    const manifest = await this.getWeb3ApiManifest();
    return manifest.import_redirects || [];
  }

  /// Web3API Manifest (web3api.yaml)

  public getWeb3ApiManifestPath(): string {
    return path.join(this._cachePath, "/web3api.yaml");
  }

  public getWeb3ApiManifestDir(): string {
    return path.dirname(this.getWeb3ApiManifestPath());
  }

  public async getWeb3ApiManifest(): Promise<Web3ApiManifest> {
    if (!this._web3apiManifest) {
      await this.createCacheDir();
      const client: Client = this._config.client;
      const uri: Uri = this._config.uri;
      this._web3apiManifest = await client.getManifest(uri, {
        type: "web3api",
      });
    }

    return Promise.resolve(this._web3apiManifest);
  }

  public async getWeb3ApiModules(): Promise<
    {
      dir: string;
      name: string;
    }[]
  > {
    const web3apiManifest = await this.getWeb3ApiManifest();
    const web3apiModules: {
      dir: string;
      name: string;
    }[] = [];

    if (web3apiManifest.modules.mutation?.module) {
      web3apiModules.push({
        dir: path
          .dirname(web3apiManifest.modules.mutation.module)
          .replace("./", ""),
        name: "mutation",
      });
    }
    if (web3apiManifest.modules.query?.module) {
      web3apiModules.push({
        dir: path
          .dirname(web3apiManifest.modules.query.module)
          .replace("./", ""),
        name: "query",
      });
    }

    return web3apiModules;
  }

  public async getWeb3ApiArtifacts(): Promise<string[]> {
    const web3apiManifest = await this.getWeb3ApiManifest();
    const web3apiArtifacts = [];

    if (web3apiManifest.modules.mutation) {
      web3apiArtifacts.push("mutation.wasm");
    }
    if (web3apiManifest.modules.query) {
      web3apiArtifacts.push("query.wasm");
    }

    return web3apiArtifacts;
  }

  /// Web3API Build Manifest (web3api.build.yaml)

  public getBuildManifestPath(): string {
    return path.join(this._cachePath, "/web3api.build.yaml");
  }

  public async getBuildManifestDir(): Promise<string> {
    return path.dirname(await this.getBuildManifestPath());
  }

  public async getBuildManifest(): Promise<BuildManifest> {
    if (!this._buildManifest) {
      await this.createCacheDir();
      const client: Client = this._config.client;
      const uri: Uri = this._config.uri;
      this._buildManifest = await client.getManifest(uri, { type: "build" });
    }

    return Promise.resolve(this._buildManifest);
  }

  /// Web3API Meta Manifest (web3api.build.yaml)

  public async getMetaManifestPath(): Promise<string | undefined> {
    const web3apiManifest = await this.getWeb3ApiManifest();

    // If the web3api.yaml manifest specifies a custom meta manifest
    if (web3apiManifest.meta) {
      return path.join(this._cachePath, "/web3api.meta.yaml");
    }
    // No meta manifest found
    else {
      return undefined;
    }
  }

  public async getMetaManifestDir(): Promise<string | undefined> {
    const manifestPath = await this.getMetaManifestPath();

    if (manifestPath) {
      return path.dirname(manifestPath);
    } else {
      return undefined;
    }
  }

  public async getMetaManifest(): Promise<MetaManifest | undefined> {
    if (!this._metaManifest) {
      const manifestPath = await this.getMetaManifestPath();
      if (manifestPath) {
        await this.createCacheDir();
        const client: Client = this._config.client;
        const uri: Uri = this._config.uri;
        this._metaManifest = await client.getManifest(uri, { type: "meta" });
      }
    }
    return this._metaManifest;
  }

  /// Support Functions

  private async createCacheDir(): Promise<void> {
    if (!fs.existsSync(this._cachePath)) {
      fs.mkdirSync(this._cachePath, { recursive: true });
    }
  }

  private async fetchAndCacheSchema(): Promise<void> {
    const client: Client = this._config.client;
    const uri: Uri = this._config.uri;

    const dir = this.getWeb3ApiManifestDir();
    const schemaPath: string = path.join(dir, "./schema.graphql");
    const schema: string = await client.getSchema(uri, {});

    await this.createCacheDir();
    await fs.promises.writeFile(schemaPath, schema);
  }
}
