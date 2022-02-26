/* eslint-disable @typescript-eslint/naming-convention */

import { Project, ProjectConfig } from "./Project";
import {
  loadWeb3ApiManifest,
  loadBuildManifest,
  loadMetaManifest,
  generateDockerImageName,
  createUUID,
  ManifestLanguage,
  outputManifest,
} from "../helpers";
import { intlMsg } from "../intl";

import { Web3ApiManifest, BuildManifest, MetaManifest } from "@web3api/core-js";
import { normalizePath } from "@web3api/os-js";
import regexParser from "regex-parser";
import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";

export interface Web3ApiProjectConfig extends ProjectConfig {
  web3apiManifestPath: string;
  buildManifestPath?: string;
  metaManifestPath?: string;
}

export class Web3ApiProject extends Project {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _metaManifest: MetaManifest | undefined;
  private _defaultBuildManifestCached = false;

  constructor(protected _config: Web3ApiProjectConfig) {
    super(_config);
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
    this._defaultBuildManifestCached = false;
  }

  public getRootDir(): string {
    return this.getWeb3ApiManifestDir();
  }

  public async getManifestLanguage(): Promise<ManifestLanguage> {
    const language = (await this.getWeb3ApiManifest()).language;

    this.validateManifestLanguage(language, ["wasm/", "interface"]);

    return language as ManifestLanguage;
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

      const root = this.getRootDir();
      const cacheDir = this.getCachePath(this.getLinkedPackagesCacheSubPath());

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
        web3api_linked_packages: this._buildManifest.linked_packages?.map(
          (linkedPackage: { name: string }) => ({
            dir: path.relative(root, path.join(cacheDir, linkedPackage.name)),
            name: linkedPackage.name,
          })
        ),
      };

      // If there exists a query & mutation module, add the query
      // module as one of the mutation module's "module_dependencies".
      // NOTE: this is a hard-coded hack, and should be generalized
      // in the future to support user-defined modules (not just query & mutation)
      if (defaultConfig.web3api_modules.length > 1) {
        const queryIdx = defaultConfig.web3api_modules.findIndex(
          (x) => x.name === "query"
        );
        const mutationIdx = defaultConfig.web3api_modules.findIndex(
          (x) => x.name === "mutation"
        );

        const queryModule = defaultConfig.web3api_modules[queryIdx];
        const mutationModule = defaultConfig.web3api_modules[mutationIdx];

        defaultConfig.web3api_modules[mutationIdx] = {
          ...mutationModule,
          module_dependencies: [
            queryModule
          ]
        } as unknown as { name: string, dir: string };
      }

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

  public async getBuildUuid(): Promise<string> {
    // Load the cached build UUID
    let uuid = this.readCacheFile("build/uuid");

    // If none was present, generate one
    if (!uuid) {
      uuid = createUUID();
      this.writeCacheFile("build/uuid", uuid, "utf-8");
    }

    return uuid;
  }

  public async cacheDefaultBuildManifestFiles(): Promise<void> {
    if (this._defaultBuildManifestCached) {
      return;
    }

    const language = await this.getManifestLanguage();

    const defaultBuildManifestFilename = "web3api.build.yaml";
    const defaultPath = `${__dirname}/../build-envs/${language}/${defaultBuildManifestFilename}`;
    const destinationDir = "build/env/";
    const buildEnvCachePath = this.getCachePath(destinationDir);

    if (!fs.existsSync(defaultPath)) {
      throw Error(
        intlMsg.lib_project_invalid_manifest_language_pathed({
          language,
          defaultPath,
        })
      );
    }

    // Clean the directory
    this.removeCacheDir("build/env");

    // Copy default build environment files into cache
    await this.copyIntoCache(
      destinationDir,
      `${__dirname}/../build-envs/${language}/*`,
      { up: true }
    );

    // Load the default build manifest
    const defaultManifest = await loadBuildManifest(defaultPath);

    // Set a unique docker image name
    defaultManifest.docker = {
      ...defaultManifest.docker,
      name: generateDockerImageName(await this.getBuildUuid()),
    };

    // Output the modified build manifest
    await outputManifest(
      defaultManifest,
      path.join(buildEnvCachePath, defaultBuildManifestFilename)
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
