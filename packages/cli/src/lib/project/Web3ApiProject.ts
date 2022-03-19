/* eslint-disable @typescript-eslint/naming-convention */

import { ProjectConfig, Project } from ".";
import {
  loadWeb3ApiManifest,
  loadBuildManifest,
  loadMetaManifest,
  generateDockerImageName,
  createUUID,
  Web3ApiManifestLanguage,
  web3apiManifestLanguages,
  isWeb3ApiManifestLanguage,
  outputManifest,
  intlMsg,
} from "..";

import { Web3ApiManifest, BuildManifest, MetaManifest } from "@web3api/core-js";
import { getCommonPath, normalizePath } from "@web3api/os-js";
import regexParser from "regex-parser";
import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";

const cacheLayout = {
  root: "web3api/",
  buildDir: "build/",
  buildEnvDir: "build/env/",
  buildUuidFile: "build/uuid",
  buildLinkedPackagesDir: "build/linked-packages/",
};

export interface Web3ApiProjectConfig extends ProjectConfig {
  web3apiManifestPath: string;
  buildManifestPath?: string;
  metaManifestPath?: string;
}

export class Web3ApiProject extends Project<Web3ApiManifest> {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _metaManifest: MetaManifest | undefined;
  private _defaultBuildManifestCached = false;

  constructor(protected _config: Web3ApiProjectConfig) {
    super(_config, cacheLayout.root);
  }

  /// Project Base Methods

  public reset(): void {
    this._web3apiManifest = undefined;
    this._buildManifest = undefined;
    this._metaManifest = undefined;
    this._defaultBuildManifestCached = false;
    this.resetCache();
  }

  public async validate(): Promise<void> {
    return Promise.resolve();
  }

  /// Manifest (web3api.yaml)

  public async getManifest(): Promise<Web3ApiManifest> {
    if (!this._web3apiManifest) {
      this._web3apiManifest = await loadWeb3ApiManifest(
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
    return this._config.web3apiManifestPath;
  }

  public async getManifestLanguage(): Promise<Web3ApiManifestLanguage> {
    const language = (await this.getManifest()).language;

    Project.validateManifestLanguage(
      language,
      web3apiManifestLanguages,
      isWeb3ApiManifestLanguage
    );

    return language as Web3ApiManifestLanguage;
  }

  /// ProjectWithSchema Base Methods

  public async getSchemaNamedPaths(): Promise<{
    [name: string]: string;
  }> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
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
    const manifest = await this.getManifest();
    return manifest.import_redirects || [];
  }

  /// Web3API Build Manifest (web3api.build.yaml)

  public async getBuildManifestPath(): Promise<string> {
    const web3apiManifest = await this.getManifest();

    // If a custom build manifest path is configured
    if (this._config.buildManifestPath) {
      return this._config.buildManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom build manifest
    else if (web3apiManifest.build) {
      this._config.buildManifestPath = path.join(
        this.getManifestDir(),
        web3apiManifest.build
      );
      return this._config.buildManifestPath;
    }
    // Use a default build manifest for the provided language
    else {
      await this.cacheDefaultBuildManifestFiles();

      // Return the cached manifest
      this._config.buildManifestPath = path.join(
        this.getCachePath(cacheLayout.buildEnvDir),
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

      const root = this.getManifestDir();
      const cacheDir = this.getCachePath(cacheLayout.buildLinkedPackagesDir);

      // Add default env variables
      const modules = await this._getWeb3ApiModules();
      const defaultConfig = {
        web3api_modules: modules.modules.map(
          (module: { dir: string; name: string }) => {
            return {
              name: module.name,
              dir: normalizePath(module.dir),
            };
          }
        ),
        web3api_common_dir: () =>
          modules.commonDir && fs.existsSync(
            path.join(this.getManifestDir(), modules.commonDir)
          )
            ? modules.commonDir
            : undefined,
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

  public async getBuildUuid(): Promise<string> {
    // Load the cached build UUID
    let uuid = this.readCacheFile(cacheLayout.buildUuidFile);

    // If none was present, generate one
    if (!uuid) {
      uuid = createUUID();
      this.writeCacheFile(cacheLayout.buildUuidFile, uuid, "utf-8");
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
    const buildEnvCachePath = this.getCachePath(cacheLayout.buildEnvDir);

    if (!fs.existsSync(defaultPath)) {
      throw Error(
        intlMsg.lib_project_invalid_manifest_language_pathed({
          language,
          defaultPath,
        })
      );
    }

    // Clean the directory
    this.removeCacheDir(cacheLayout.buildEnvDir);

    // Copy default build environment files into cache
    await this.copyIntoCache(
      cacheLayout.buildEnvDir,
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
      path.join(buildEnvCachePath, defaultBuildManifestFilename),
      this._config.quiet
    );

    this._defaultBuildManifestCached = true;
  }

  public async cacheBuildManifestLinkedPackages(): Promise<void> {
    const buildManifest = await this.getBuildManifest();

    if (buildManifest.linked_packages) {
      const rootDir = this.getManifestDir();
      const cacheSubPath = this.getCachePath(
        cacheLayout.buildLinkedPackagesDir
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

  /// Web3API Meta Manifest (web3api.build.yaml)

  public async getMetaManifestPath(): Promise<string | undefined> {
    const web3apiManifest = await this.getManifest();

    // If a custom meta manifest path is configured
    if (this._config.metaManifestPath) {
      return this._config.metaManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom meta manifest
    else if (web3apiManifest.meta) {
      this._config.metaManifestPath = path.join(
        this.getManifestDir(),
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

  public async getManifestPaths(absolute = false): Promise<string[]> {
    const root = this.getManifestDir();
    const paths = [
      absolute
        ? this.getManifestPath()
        : path.relative(root, this.getManifestPath()),
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

  /// Private Helpers

  private async _getWeb3ApiModules(): Promise<{
    modules: {
      dir: string;
      name: string;
    }[];
    commonDir?: string;
  }> {
    const web3apiManifest = await this.getManifest();
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

    let commonDir: string | undefined;

    if (web3apiModules.length > 1) {
      const module1 = web3apiModules[0];
      const module2 = web3apiModules[1];
      commonDir = getCommonPath(module1.dir, module2.dir) + "w3";
    }

    return {
      modules: web3apiModules,
      commonDir,
    };
  }
}
