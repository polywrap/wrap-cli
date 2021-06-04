/* eslint-disable @typescript-eslint/naming-convention */

import { loadWeb3ApiManifest, loadBuildManifest } from "./helpers";
import { intlMsg } from "./intl";

import { Web3ApiManifest, BuildManifest } from "@web3api/core-js";
import path from "path";
import fs from "fs";
import rimraf from "rimraf";
import copyfiles from "copyfiles";

export interface ProjectConfig {
  web3apiManifestPath: string;
  buildManifestPath?: string;
  quiet?: boolean;
}

export class Project {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _defaultBuildManifestCached = false;

  constructor(private _config: ProjectConfig) {}

  get quiet(): boolean {
    return !!this._config.quiet;
  }

  public reset(): void {
    this._web3apiManifest = undefined;
    this._buildManifest = undefined;
    this._defaultBuildManifestCached = false;
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

  public async getWeb3ApiModules(): Promise<{
    dir: string,
    name: string,
  }[]> {
    const web3apiManifest = await this.getWeb3ApiManifest();
    const web3apiModules: {
      dir: string,
      name: string,
    }[] = [];

    if (web3apiManifest.modules.mutation) {
      web3apiModules.push({
        dir: path.dirname(web3apiManifest.modules.mutation.module).replace("./", ""),
        name: "mutation"
      });
    }
    if (web3apiManifest.modules.query) {
      web3apiModules.push({
        dir: path.dirname(web3apiManifest.modules.query.module).replace("./", ""),
        name: "query"
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
        web3api_modules: await this.getWeb3ApiModules(),
        web3api_manifests: await this.getManifestPaths(),
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

    const defaultPath = `${__dirname}/build-envs/${language}/web3api.build.yaml`;

    if (!fs.existsSync(defaultPath)) {
      throw Error(
        intlMsg.lib_project_invalid_build_language({ language, defaultPath })
      );
    }

    // Update the cache
    this.removeCacheDir("build/env");
    await this.copyFilesIntoCache(
      "build/env/",
      `${__dirname}/build-envs/${language}/*`
    );
    this._defaultBuildManifestCached = true;
  }

  /// Cache (.w3 folder)

  public getCacheDir(): string {
    return path.join(this.getWeb3ApiManifestDir(), ".w3");
  }

  public readCacheFile(file: string): string | undefined {
    const filePath = path.join(this.getCacheDir(), file);

    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    return fs.readFileSync(filePath, "utf-8");
  }

  public removeCacheDir(subfolder: string): void {
    const folderPath = path.join(this.getCacheDir(), subfolder);
    rimraf.sync(folderPath);
  }

  public getCachePath(subpath: string): string {
    return path.join(this.getCacheDir(), subpath);
  }

  public async copyFilesIntoCache(
    destSubfolder: string,
    sourceFolder: string
  ): Promise<void> {
    const dest = this.getCachePath(destSubfolder);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    await new Promise((resolve, reject) => {
      copyfiles([sourceFolder, dest], { up: true }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
