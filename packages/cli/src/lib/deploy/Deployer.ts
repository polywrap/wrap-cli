/* eslint-disable @typescript-eslint/no-var-requires */

import { loadDeployManifest, loadDeployManifestExt } from "../project";
import { CacheDirectory } from "../CacheDirectory";
import { Logger } from "../logging";

import { Uri } from "@polywrap/core-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import { Schema as JsonSchema } from "jsonschema";
import path from "path";
import nodePath from "path";

export interface DeployModule {
  execute(uri: Uri, config?: unknown): Promise<Uri>;
}

interface DeployerConfig {
  cache: CacheDirectory;
  logger: Logger;
  defaultModulesCached: boolean;
}

export class Deployer {
  public static cacheLayout = {
    root: "deploy/",
    deployModulesDir: "modules/",
  };
  public manifest: DeployManifest;
  private _config: DeployerConfig;

  private constructor(
    manifest: DeployManifest,
    cache: CacheDirectory,
    logger: Logger
  ) {
    this._config = {
      logger,
      cache,
      defaultModulesCached: false,
    };
    this.manifest = manifest;
  }

  public static async create(
    manifest: string,
    logger: Logger
  ): Promise<Deployer> {
    const deployManifest = await loadDeployManifest(manifest, logger);
    const cache = new CacheDirectory({
      rootDir: nodePath.dirname(manifest),
      subDir: Deployer.cacheLayout.root,
    });
    return new Deployer(deployManifest, cache, logger);
  }

  public async getDeployModule(
    moduleName: string
  ): Promise<{
    deployModule: DeployModule;
    manifestExt: JsonSchema | undefined;
  }> {
    if (!this._config.defaultModulesCached) {
      throw new Error("Deploy modules have not been cached");
    }

    const cachePath = this._config.cache.getCachePath(
      `${Deployer.cacheLayout.deployModulesDir}/${moduleName}`
    );

    const manifestExtPath = path.join(cachePath, "polywrap.deploy.ext.json");

    const manifestExt = await loadDeployManifestExt(
      manifestExtPath,
      this._config.logger
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      deployModule: require(cachePath).default as DeployModule,
      manifestExt,
    };
  }

  public async cacheDeployModules(modules: string[]): Promise<void> {
    if (this._config.defaultModulesCached) {
      return;
    }

    this._config.cache.removeCacheDir(Deployer.cacheLayout.deployModulesDir);

    for await (const deployModule of modules) {
      await this._config.cache.copyIntoCache(
        `${Deployer.cacheLayout.deployModulesDir}/${deployModule}`,
        `${__dirname}/../defaults/deploy-modules/${deployModule}/*`,
        { up: true }
      );
    }

    this._config.defaultModulesCached = true;
  }
}
