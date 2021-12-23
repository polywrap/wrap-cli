/* eslint-disable @typescript-eslint/naming-convention */

import { Project, ProjectConfig } from "./Project";
import {
  loadWeb3ApiManifest,
  loadBuildManifest,
  loadMetaManifest,
  manifestLanguageToTargetLanguage,
} from "../helpers";
import { intlMsg } from "../intl";

import { Web3ApiManifest, BuildManifest, MetaManifest, Client, ManifestType } from "@web3api/core-js";
import { TargetLanguage } from "@web3api/schema-bind";
import path from "path";
import fs from "fs";

export interface ExternalWeb3ApiProjectConfig extends ProjectConfig {
  uri: string;
  namespace: string;
  client: Client;
}

export class ExternalWeb3ApiProject extends Project {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _metaManifest: MetaManifest | undefined;
  private _cacheSubpath: string;

  constructor(protected _config: ExternalWeb3ApiProjectConfig) {
    super(_config);
    this._cacheSubpath = `ExternalProjects/${this._config.namespace}`;
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
    return this.getWeb3ApiManifestDir();
  }

  public async getLanguage(): Promise<TargetLanguage> {
    const language = (await this.getWeb3ApiManifest()).language;
    if (!language) {
      throw Error(intlMsg.lib_project_language_not_found());
    }
    return manifestLanguageToTargetLanguage(language);
  }

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getWeb3ApiManifest();
    const dir = this.getWeb3ApiManifestDir();
    const namedPaths: { [name: string]: string } = {};

    if (manifest.modules.mutation) {
      namedPaths["mutation"] = path.join(dir, manifest.modules.mutation.schema);
    }

    if (manifest.modules.query) {
      namedPaths["query"] = path.join(dir, manifest.modules.query.schema);
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
    return path.join(this._cacheSubpath, "/web3api.yaml");
  }

  public getWeb3ApiManifestDir(): string {
    return path.dirname(this.getWeb3ApiManifestPath());
  }

  public async getWeb3ApiManifest(): Promise<Web3ApiManifest> {
    if (!this._web3apiManifest) {
      const manifestPath: string = this.getWeb3ApiManifestPath();
      if(!fs.existsSync(manifestPath)) {
        await this.fetchAndCacheManifest("web3api");
      }
      this._web3apiManifest = await loadWeb3ApiManifest(
        this.getWeb3ApiManifestPath(),
        this.quiet
      );
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
    return path.join(this._cacheSubpath, "/web3api.build.yaml");
  }

  public async getBuildManifestDir(): Promise<string> {
    return path.dirname(await this.getBuildManifestPath());
  }

  public async getBuildManifest(): Promise<BuildManifest> {
    if (!this._buildManifest) {
      const manifestPath: string = this.getBuildManifestPath();
      if(!fs.existsSync(manifestPath)) {
        await this.fetchAndCacheManifest("build");
      }
      this._buildManifest = await loadBuildManifest(
        manifestPath,
        this.quiet
      );
    }

    return Promise.resolve(this._buildManifest);
  }

  /// Web3API Meta Manifest (web3api.build.yaml)

  public async getMetaManifestPath(): Promise<string | undefined> {
    const web3apiManifest = await this.getWeb3ApiManifest();

    // If the web3api.yaml manifest specifies a custom meta manifest
    if (web3apiManifest.meta) {
      return path.join(this._cacheSubpath, "/web3api.meta.yaml");
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
        if(!fs.existsSync(manifestPath)) {
          await this.fetchAndCacheManifest("meta");
        }
        this._metaManifest = await loadMetaManifest(manifestPath, this.quiet);
      }
    }
    return this._metaManifest;
  }

  /// Support Functions

  private async fetchAndCacheManifest(type: ManifestType): Promise<void> {
    const client: Client = this._config.client;
    const uri: string = this._config.uri;

    let manifest: string;
    const fileTitle: string =
      type === "web3api" ? "web3api" : "web3api." + type;
    try {
      // try common yaml suffix
      const path: string = fileTitle + ".yaml";
      manifest = (await client.getFile(
        uri,
        { path, encoding: "utf8" }
      )) as string;
    } catch {
      // try alternate yaml suffix
      const path: string = fileTitle + ".yml";
      manifest = (await client.getFile(
        uri,
        { path, encoding: "utf8" }
      )) as string;
    }

    const manifestPath = path.join(this._cacheSubpath, `/${fileTitle}.yaml`);
    if (!fs.existsSync(this._cacheSubpath)) {
      fs.mkdirSync(this._cacheSubpath, { recursive: true });
    }
    await fs.promises.writeFile(manifestPath, manifest);
  }

  private async fetchAndCacheSchema(): Promise<void> {
    const client: Client = this._config.client;
    const uri: string = this._config.uri;

    const manifest = await this.getWeb3ApiManifest();
    const dir = this.getWeb3ApiManifestDir();
    let schemaPath: string;
    if (manifest.modules.query) {
      schemaPath = path.join(dir, manifest.modules.query.schema);
    } else if (manifest.modules.mutation) {
      schemaPath = path.join(dir, manifest.modules.mutation.schema);
    } else {
      schemaPath = path.join(dir, "./schema.graphql");
    }

    const schema: string = await client.getSchema(uri, {});
    await fs.promises.writeFile(schemaPath, schema);
  }
}
