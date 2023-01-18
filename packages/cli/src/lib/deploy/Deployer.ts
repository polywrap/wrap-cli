/* eslint-disable @typescript-eslint/no-var-requires */

import {
  DeployStep,
  DeployModule,
  DeployPackage,
  DeployJob,
  DeployJobResult,
} from ".";
import {
  loadDeployManifest,
  loadDeployManifestExt,
  CacheDirectory,
  Logger,
} from "..";

import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import { Schema as JsonSchema, validate } from "jsonschema";
import path from "path";
import fs from "fs";

interface DeployerConfig {
  cache: CacheDirectory;
  logger: Logger;
  defaultModulesCached: boolean;
}

type DeployManifestJob = DeployManifest["jobs"][number];
type DeployManifestStep = DeployManifestJob["steps"][number];

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
      rootDir: path.dirname(manifest),
      subDir: Deployer.cacheLayout.root,
    });
    return new Deployer(deployManifest, cache, logger);
  }

  public async run(): Promise<DeployJobResult[]> {
    const allStepsFromAllJobs = Object.entries(this.manifest.jobs).flatMap(
      ([jobName, job]) => {
        return job.steps.map((step) => ({
          jobName,
          ...step,
        }));
      }
    );

    const packageNames = [
      ...new Set(allStepsFromAllJobs.map((step) => step.package)),
    ];

    this._sanitizePackages(packageNames);

    await this._cacheDeployModules(packageNames);

    const packageMapEntries = await Promise.all(
      packageNames.map(async (packageName) => {
        const deployerPackage = await this._getDeployModule(packageName);
        return [packageName, deployerPackage];
      })
    );

    const packageMap = Object.fromEntries(packageMapEntries);

    const stepToPackageMap: Record<
      string,
      DeployPackage & { jobName: string }
    > = {};

    for (const step of allStepsFromAllJobs) {
      stepToPackageMap[step.name] = {
        ...packageMap[step.package],
        jobName: step.jobName,
      };
    }

    this._validateManifestWithExts(this.manifest, stepToPackageMap);

    const jobs = Object.entries(this.manifest.jobs).map(([jobName, job]) => {
      const steps: DeployStep[] = job.steps.map((step) => {
        return new DeployStep({
          name: step.name,
          uriOrStepResult: step.uri,
          deployModule: stepToPackageMap[step.name].deployModule,
          config: step.config ?? {},
        });
      });

      return new DeployJob({
        name: jobName,
        steps,
        config: job.config ?? {},
        logger: this._config.logger,
      });
    });

    return await Promise.all(jobs.map((job) => job.run()));
  }

  private _sanitizePackages(packages: string[]) {
    const unrecognizedPackages: string[] = [];

    const availableDeployers = fs.readdirSync(
      path.join(__dirname, "..", "defaults", "deploy-modules")
    );

    packages.forEach((p) => {
      if (!availableDeployers.includes(p)) {
        unrecognizedPackages.push(p);
      }
    });

    if (unrecognizedPackages.length) {
      throw new Error(
        `Unrecognized packages: ${unrecognizedPackages.join(", ")}`
      );
    }
  }

  private async _getDeployModule(
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

  private async _cacheDeployModules(modules: string[]): Promise<void> {
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

  private _validateManifestWithExts(
    deployManifest: DeployManifest,
    stepToPackageMap: Record<string, DeployPackage & { jobName: string }>
  ) {
    const errors = Object.entries(stepToPackageMap).flatMap(
      ([stepName, step]) => {
        const jobEntry = Object.entries(deployManifest.jobs).find(
          ([jobName]) => jobName === step.jobName
        ) as [string, DeployManifestJob];

        const job = jobEntry[1];

        const stepToValidate = job.steps.find(
          (s) => s.name === stepName
        ) as DeployManifestStep;

        return step.manifestExt
          ? validate(
              {
                ...job.config,
                ...stepToValidate.config,
              },
              step.manifestExt
            ).errors
          : [];
      }
    );

    if (errors.length) {
      throw new Error(
        [
          `Validation errors encountered while sanitizing DeployManifest format ${deployManifest.format}`,
          ...errors.map((error) => error.toString()),
        ].join("\n")
      );
    }
  }
}
