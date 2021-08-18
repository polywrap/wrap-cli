/* eslint-disable @typescript-eslint/naming-convention */

import { Project, ProjectConfig } from "./Project";
import {
  loadWeb3ApiManifest,
  loadBuildManifest,
  manifestLanguageToTargetLanguage,
} from "../helpers";
import { intlMsg } from "../intl";

import { Web3ApiManifest, BuildManifest } from "@web3api/core-js";
import { TargetLanguage } from "@web3api/schema-bind";
import { normalizePath } from "@web3api/os-js";
import path from "path";
import fs from "fs";

export interface Web3ApiProjectConfig extends ProjectConfig {
  web3apiManifestPath: string;
  buildManifestPath?: string;
}

export class Web3ApiProject extends Project {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _defaultBuildManifestCached = false;

  constructor(protected _config: Web3ApiProjectConfig) {
    super(_config);
  }

  public async getManifestPaths(absolute = false): Promise<string[]> {
    const web3apiManifestPath = this.getWeb3ApiManifestPath();
    const root = path.dirname(web3apiManifestPath);

    return [
      absolute ? web3apiManifestPath : path.relative(root, web3apiManifestPath),
      absolute
        ? await this.getBuildManifestPath()
        : path.relative(root, await this.getBuildManifestPath()),
    ];
  }

  /// Project Base Methods

  public reset(): void {
    this._web3apiManifest = undefined;
    this._buildManifest = undefined;
    this._defaultBuildManifestCached = false;
  }

  public getRootDir(): string {
    return this.getWeb3ApiManifestDir();
  }

  public async getLanguage(): Promise<TargetLanguage> {
    const language = (await this.getWeb3ApiManifest()).language;
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
    return this._config.web3apiManifestPath;
  }

  public getWeb3ApiManifestDir(): string {
    return path.dirname(this.getWeb3ApiManifestPath());
  }

  public async getWeb3ApiManifest(): Promise<Web3ApiManifest> {
    if (!this._web3apiManifest) {
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

  public async getBuildManifestPath(): Promise<string> {
    const web3apiManifest = await this.getWeb3ApiManifest();

    // If a custom build manifest path is configured
    if (this._config.buildManifestPath) {
      return this._config.buildManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom build manifest
    else if (web3apiManifest.build) {
      this._config.buildManifestPath = path.join(
        this.getWeb3ApiManifestDir(),
        web3apiManifest.build
      );
      return this._config.buildManifestPath;
    }
    // Use a default build manifest for the provided language
    else {
      await this.cacheDefaultBuildManifestFiles();

      // Return the cached manifest
      this._config.buildManifestPath = path.join(
        this.getCachePath("build/env"),
        "web3api.build.yaml"
      );
      return this._config.buildManifestPath;
    }
  }

  public async getBuildManifestDir(): Promise<string> {
    return path.dirname(await this.getBuildManifestPath());
  }

  public async getBuildManifest(): Promise<BuildManifest> {
    if (!this._buildManifest) {
      this._buildManifest = await loadBuildManifest(
        await this.getBuildManifestPath(),
        this.quiet
      );

      // Add default env variables
      const defaultConfig = {
        web3api_modules: (await this.getWeb3ApiModules()).map(
          (module: { dir: string; name: string }) => {
            return {
              name: module.name,
              dir: normalizePath(module.dir),
            };
          }
        ),
        web3api_manifests: (await this.getManifestPaths()).map(
          (path: string) => {
            return normalizePath(path);
          }
        ),
      };

      if (!this._buildManifest.config) {
        this._buildManifest.config = defaultConfig;
      } else {
        this._buildManifest.config = {
          ...this._buildManifest.config,
          ...defaultConfig,
        };
      }
    }

    return this._buildManifest;
  }

  public async cacheDefaultBuildManifestFiles(): Promise<void> {
    if (this._defaultBuildManifestCached) {
      return;
    }

    const language = (await this.getWeb3ApiManifest()).language;

    if (!language) {
      throw Error(intlMsg.lib_project_language_not_found());
    }

    const defaultPath = `${__dirname}/../build-envs/${language}/web3api.build.yaml`;

    if (!fs.existsSync(defaultPath)) {
      throw Error(
        intlMsg.lib_project_invalid_build_language({ language, defaultPath })
      );
    }

    // Update the cache
    this.removeCacheDir("build/env");
    await this.copyFilesIntoCache(
      "build/env/",
      `${__dirname}/../build-envs/${language}/*`
    );
    this._defaultBuildManifestCached = true;
  }
}
