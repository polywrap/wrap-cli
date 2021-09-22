/* eslint-disable @typescript-eslint/naming-convention */

import { Project, ProjectConfig } from "./Project";
import {
  loadWeb3ApiManifest,
  loadBuildManifest,
  loadInfraManifest,
  loadMetaManifest,
  manifestLanguageToTargetLanguage,
} from "../helpers";
import { intlMsg } from "../intl";

import {
  Web3ApiManifest,
  BuildManifest,
  InfraManifest,
  MetaManifest
} from "@web3api/core-js";
import { TargetLanguage } from "@web3api/schema-bind";
import { normalizePath } from "@web3api/os-js";
import regexParser from "regex-parser";
import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";

export interface Web3ApiProjectConfig extends ProjectConfig {
  web3apiManifestPath: string;
  buildManifestPath?: string;
  infraManifestPath?: string;
  metaManifestPath?: string;
}

export class Web3ApiProject extends Project {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _infraManifest: InfraManifest | undefined;
  private _metaManifest: MetaManifest | undefined;
  private _defaultBuildManifestCached = false;
  private _defaultInfraManifestCached = false;

  constructor(protected _config: Web3ApiProjectConfig) {
    super(_config);
  }

  public async getManifestPaths(absolute = false): Promise<string[]> {
    const web3apiManifestPath = this.getWeb3ApiManifestPath();
    const root = path.dirname(web3apiManifestPath);
    const paths = [
      absolute ? web3apiManifestPath : path.relative(root, web3apiManifestPath),
      absolute
        ? await this.getInfraManifestPath()
        : path.relative(root, await this.getInfraManifestPath()),
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
    this._infraManifest = undefined;
    this._defaultBuildManifestCached = false;
    this._defaultInfraManifestCached = false;
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
      await this.cacheDefaultBuildConfig();

      // Return the cached manifest
      this._config.buildManifestPath = path.join(
        this.getCachePath("build/config"),
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

      const root = this.getRootDir();
      const cacheDir = this.getCachePath(this.getLinkedPackagesCacheSubPath());

      // Add default config variables
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
        web3api_linked_packages: this._buildManifest.linked_packages?.map(
          (linkedPackage: { name: string }) => ({
            dir: path.relative(root, path.join(cacheDir, linkedPackage.name)),
            name: linkedPackage.name,
          })
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

  public async cacheDefaultBuildConfig(): Promise<void> {
    if (this._defaultBuildManifestCached) {
      return;
    }

    const language = (await this.getWeb3ApiManifest()).language;

    if (!language) {
      throw Error(intlMsg.lib_project_language_not_found());
    }

    const defaultPath = `${__dirname}/../build-configs/${language}/web3api.build.yaml`;

    if (!fs.existsSync(defaultPath)) {
      throw Error(
        intlMsg.lib_project_invalid_build_language({ language, defaultPath })
      );
    }

    // Update the cache
    this.removeCacheDir("build/config");
    await this.copyFilesIntoCache(
      "build/config/",
      `${__dirname}/../build-configs/${language}/*`,
      { up: true }
    );
    this._defaultBuildManifestCached = true;
  }

  public async cacheBuildManifestLinkedPackages(): Promise<void> {
    const buildManifest = await this.getBuildManifest();

    if (buildManifest.linked_packages) {
      const rootDir = this.getRootDir();
      const cacheSubPath = this.getCachePath(
        this.getLinkedPackagesCacheSubPath()
      );

      buildManifest.linked_packages.map(
        (linkedPackage: { path: string; name: string; filter?: string }) => {
          const sourceDir = path.join(rootDir, linkedPackage.path);
          const destinationDir = path.join(cacheSubPath, linkedPackage.name);

          // Update the cache
          this.removeCacheDir(destinationDir);
          fsExtra.copySync(sourceDir, destinationDir, {
            overwrite: true,
            dereference: true,
            recursive: true,
            filter: (src: string) => {
              if (fs.lstatSync(src).isSymbolicLink()) {
                return false;
              }

              if (linkedPackage.filter) {
                const regexFilter = regexParser(linkedPackage.filter);
                const result = regexFilter.test(src);
                if (result) {
                  return false;
                }
              }

              return true;
            },
          });
        }
      );
    }
  }

  public getLinkedPackagesCacheSubPath(): string {
    return "build/linked-packages";
  }

  /// Web3API Infra Manifest (web3api.infra.yaml)

  public async getInfraManifestPath(): Promise<string> {
    const web3apiManifest = await this.getWeb3ApiManifest();

    // If a custom infra manifest path is configured
    if (this._config.infraManifestPath) {
      return this._config.infraManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom infra manifest
    else if (web3apiManifest.infra) {
      this._config.infraManifestPath = path.join(
        this.getWeb3ApiManifestDir(),
        web3apiManifest.infra
      );

      return this._config.infraManifestPath;
    }
    // Use the default infra manifest
    else {
      await this.cacheDefaultInfraConfig();

      // Return the cached manifest
      this._config.infraManifestPath = path.join(
        this.getCachePath("infra/config"),
        "web3api.infra.yaml"
      );
      return this._config.infraManifestPath;
    }
  }

  public async getInfraManifestDir(): Promise<string> {
    return path.dirname(await this.getInfraManifestPath());
  }

  public async getInfraManifest(): Promise<InfraManifest> {
    if (!this._infraManifest) {
      this._infraManifest = await loadInfraManifest(
        await this.getInfraManifestPath(),
        this.quiet
      );
    }

    return this._infraManifest;
  }

  public async cacheDefaultInfraConfig(): Promise<void> {
    if (this._defaultInfraManifestCached) {
      return;
    }

    // Update the cache
    this.removeCacheDir("infra/config");
    await this.copyFilesIntoCache("infra/config", `${__dirname}/../infra-configs/default/*`);

    this._defaultInfraManifestCached = true;
  }

  /// Web3API Meta Manifest (web3api.build.yaml)

  public async getMetaManifestPath(): Promise<string | undefined> {
    const web3apiManifest = await this.getWeb3ApiManifest();

    // If a custom meta manifest path is configured
    if (this._config.metaManifestPath) {
      return this._config.metaManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom meta manifest
    else if (web3apiManifest.meta) {
      this._config.metaManifestPath = path.join(
        this.getWeb3ApiManifestDir(),
        web3apiManifest.meta
      );
      return this._config.metaManifestPath;
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
        this._metaManifest = await loadMetaManifest(manifestPath, this.quiet);
      }
    }
    return this._metaManifest;
  }
}
