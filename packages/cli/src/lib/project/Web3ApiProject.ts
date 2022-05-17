/* eslint-disable @typescript-eslint/no-var-requires */
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
  loadDeployManifest,
  loadDeployManifestExt,
  web3apiManifestLanguageToBindLanguage,
  resetDir,
} from "..";
import { Deployer } from "../deploy";

import {
  Web3ApiManifest,
  BuildManifest,
  MetaManifest,
  DeployManifest,
} from "@web3api/core-js";
import { getCommonPath, normalizePath } from "@web3api/os-js";
import { bindSchema, BindOutput, BindOptions } from "@web3api/schema-bind";
import { ComposerOutput } from "@web3api/schema-compose";
import { TypeInfo } from "@web3api/schema-parse";
import regexParser from "regex-parser";
import path from "path";
import { Schema as JsonSchema } from "jsonschema";
import fs from "fs";
import fsExtra from "fs-extra";

const cacheLayout = {
  root: "web3api/",
  buildDir: "build/",
  buildEnvDir: "build/env/",
  buildUuidFile: "build/uuid",
  buildLinkedPackagesDir: "build/linked-packages/",
  deployDir: "deploy/",
  deployEnvDir: "deploy/env/",
};

export interface Web3ApiProjectConfig extends ProjectConfig {
  web3apiManifestPath: string;
  buildManifestPath?: string;
  deployManifestPath?: string;
  metaManifestPath?: string;
}

export class Web3ApiProject extends Project<Web3ApiManifest> {
  private _web3apiManifest: Web3ApiManifest | undefined;
  private _buildManifest: BuildManifest | undefined;
  private _deployManifest: DeployManifest | undefined;
  private _metaManifest: MetaManifest | undefined;
  private _defaultBuildManifestCached = false;
  private _deploymentPackagesCached = false;

  constructor(protected _config: Web3ApiProjectConfig) {
    super(_config, cacheLayout.root);
  }

  /// Project Base Methods

  public reset(): void {
    this._web3apiManifest = undefined;
    this._buildManifest = undefined;
    this._metaManifest = undefined;
    this._deployManifest = undefined;
    this._defaultBuildManifestCached = false;
    this._deploymentPackagesCached = false;
    this.removeCacheDir(cacheLayout.buildEnvDir);
    this.removeCacheDir(cacheLayout.buildLinkedPackagesDir);
  }

  public async validate(): Promise<void> {
    return Promise.resolve();
  }

  /// Manifest (web3api.yaml)

  public async getName(): Promise<string> {
    return (await this.getManifest()).name;
  }

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

  /// Schema

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

  public async generateSchemaBindings(
    composerOutput: ComposerOutput,
    generationSubPath = "w3"
  ): Promise<BindOutput> {
    const manifest = await this.getManifest();
    const queryModule = manifest.modules.query?.module as string;
    const queryDirectory = manifest.modules.query
      ? this._getGenerationDirectory(queryModule, generationSubPath)
      : undefined;
    const mutationModule = manifest.modules.mutation?.module as string;
    const mutationDirectory = manifest.modules.mutation
      ? this._getGenerationDirectory(mutationModule, generationSubPath)
      : undefined;

    if (
      queryDirectory &&
      mutationDirectory &&
      queryDirectory === mutationDirectory
    ) {
      throw Error(
        intlMsg.lib_compiler_dup_code_folder({ directory: queryDirectory })
      );
    }

    // Clean the code generation
    if (queryDirectory) {
      resetDir(queryDirectory);
    }

    if (mutationDirectory) {
      resetDir(mutationDirectory);
    }

    const bindLanguage = web3apiManifestLanguageToBindLanguage(
      await this.getManifestLanguage()
    );

    const options: BindOptions = {
      projectName: manifest.name,
      modules: [],
      bindLanguage,
    };

    if (manifest.modules.query) {
      options.modules.push({
        name: "query",
        typeInfo: composerOutput.query?.typeInfo as TypeInfo,
        schema: composerOutput.combined?.schema as string,
        outputDirAbs: queryDirectory as string,
      });
    }

    if (manifest.modules.mutation) {
      options.modules.push({
        name: "mutation",
        typeInfo: composerOutput.mutation?.typeInfo as TypeInfo,
        schema: composerOutput.combined?.schema as string,
        outputDirAbs: mutationDirectory as string,
      });
    }

    if (mutationDirectory && queryDirectory) {
      options.commonDirAbs = path.join(
        getCommonPath(queryDirectory, mutationDirectory),
        "w3"
      );
    }

    return bindSchema(options);
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
          modules.commonDir &&
          fs.existsSync(path.join(this.getManifestDir(), modules.commonDir))
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

  /// Web3API Deploy Manifest (web3api.deploy.yaml)

  public async getDeployManifestPath(): Promise<string | undefined> {
    const web3apiManifest = await this.getManifest();

    // If a custom deploy manifest path is configured
    if (this._config.deployManifestPath) {
      return this._config.deployManifestPath;
    }
    // If the web3api.yaml manifest specifies a custom deploy manifest
    else if (web3apiManifest.deploy) {
      this._config.deployManifestPath = path.join(
        this.getManifestDir(),
        web3apiManifest.deploy
      );
      return this._config.deployManifestPath;
    }
    // No deploy manifest found
    else {
      return undefined;
    }
  }

  public async getDeployManifestDir(): Promise<string | undefined> {
    const manifestPath = await this.getDeployManifestPath();

    if (manifestPath) {
      return path.dirname(manifestPath);
    } else {
      return undefined;
    }
  }

  public async getDeployManifest(): Promise<DeployManifest | undefined> {
    if (!this._deployManifest) {
      const manifestPath = await this.getDeployManifestPath();

      if (manifestPath) {
        this._deployManifest = await loadDeployManifest(
          manifestPath,
          this.quiet
        );
      }
    }
    return this._deployManifest;
  }

  public async getDeploymentPackage(
    packageName: string
  ): Promise<{ deployer: Deployer; manifestExt: JsonSchema | undefined }> {
    if (!this._deploymentPackagesCached) {
      throw new Error("Deployment packages have not been cached");
    }

    const cachePath = this.getCachePath(
      `${cacheLayout.deployEnvDir}/${packageName}`
    );

    const manifestExtPath = path.join(cachePath, "web3api.deploy.ext.json");

    const manifestExt = await loadDeployManifestExt(manifestExtPath);

    return {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      deployer: require(cachePath).default as Deployer,
      manifestExt,
    };
  }

  public async cacheDeploymentPackages(packages: string[]): Promise<void> {
    if (this._deploymentPackagesCached) {
      return;
    }

    this.removeCacheDir(cacheLayout.deployEnvDir);

    for await (const deployPackage of packages) {
      await this.copyIntoCache(
        `${cacheLayout.deployEnvDir}/${deployPackage}`,
        `${__dirname}/../deployers/${deployPackage}/*`,
        { up: true }
      );
    }

    this._deploymentPackagesCached = true;
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

    const deployManifestPath = await this.getDeployManifestPath();

    if (deployManifestPath) {
      paths.push(
        absolute ? deployManifestPath : path.relative(root, deployManifestPath)
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

  private _getGenerationDirectory(
    entryPoint: string,
    generationSubPath: string
  ): string {
    const absolute = path.isAbsolute(entryPoint)
      ? entryPoint
      : path.join(this.getManifestDir(), entryPoint);
    return path.join(path.dirname(absolute), generationSubPath);
  }
}
