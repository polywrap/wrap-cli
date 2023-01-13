/* eslint-disable @typescript-eslint/no-var-requires */

import { Deployer } from "./deployer";
import { loadDeployManifest, loadDeployManifestExt } from "../project";
import { CacheDirectory } from "../CacheDirectory";
import { Logger } from "../logging";

import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import { Schema as JsonSchema } from "jsonschema";
import path from "path";

interface PolywrapDeployConfig {
  cache: CacheDirectory;
  logger: Logger;
  defaultModulesCached: boolean;
}

export class PolywrapDeploy {
  public static cacheLayout = {
    root: "wasm/",
    deployDir: "deploy/",
    deployModulesDir: "deploy/modules/",
  };
  public manifest: DeployManifest;
  private _config: PolywrapDeployConfig;

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
  ): Promise<PolywrapDeploy> {
    const deployManifest = await loadDeployManifest(manifest, logger);
    const cache = new CacheDirectory({
      rootDir: manifest,
      subDir: PolywrapDeploy.cacheLayout.root,
    });
    return new PolywrapDeploy(deployManifest, cache, logger);
  }

  public async getDeployModule(
    moduleName: string
  ): Promise<{ deployer: Deployer; manifestExt: JsonSchema | undefined }> {
    if (!this._config.defaultModulesCached) {
      throw new Error("Deploy modules have not been cached");
    }

    const cachePath = this._config.cache.getCachePath(
      `${PolywrapDeploy.cacheLayout.deployModulesDir}/${moduleName}`
    );

    const manifestExtPath = path.join(cachePath, "polywrap.deploy.ext.json");

    const manifestExt = await loadDeployManifestExt(
      manifestExtPath,
      this._config.logger
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      deployer: require(cachePath).default as Deployer,
      manifestExt,
    };
  }

  public async cacheDeployModules(modules: string[]): Promise<void> {
    if (this._config.defaultModulesCached) {
      return;
    }

    this._config.cache.removeCacheDir(
      PolywrapDeploy.cacheLayout.deployModulesDir
    );

    for await (const deployModule of modules) {
      await this._config.cache.copyIntoCache(
        `${PolywrapDeploy.cacheLayout.deployModulesDir}/${deployModule}`,
        `${__dirname}/../defaults/deploy-modules/${deployModule}/*`,
        { up: true }
      );
    }

    this._config.defaultModulesCached = true;
  }
}
