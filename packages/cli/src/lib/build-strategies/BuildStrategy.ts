import { BuildOverrides, tryGetBuildOverrides } from "./BuildOverrides";
import { PolywrapProject } from "../project";

import fse from "fs-extra";
import path from "path";

export interface BuildStrategyConfig {
  project: PolywrapProject;
  outputDir: string;
}

export abstract class BuildStrategy<TBuildReturn = unknown> {
  protected project: PolywrapProject;
  protected outputDir: string;
  protected overrides?: BuildOverrides;

  constructor({ project, outputDir }: BuildStrategyConfig) {
    this.project = project;
    this.outputDir = outputDir;
  }

  abstract buildSources(): Promise<TBuildReturn>;

  abstract getStrategyName(): string;

  async build(): Promise<TBuildReturn> {
    const language = await this.project.getManifestLanguage();
    const buildStrategyDir = path.join(
      __dirname,
      "..",
      "defaults",
      "build-strategies",
      language,
      this.getStrategyName()
    );

    // Cache all build strategy files
    const strategyUsedCacheDir = this.project.getCachePath(
      PolywrapProject.cacheLayout.buildStrategyUsed
    );
    if (fse.existsSync(strategyUsedCacheDir)) {
      fse.removeSync(strategyUsedCacheDir);
    }
    fse.mkdirSync(strategyUsedCacheDir, { recursive: true });
    fse.copySync(buildStrategyDir, strategyUsedCacheDir);

    // Check if build overrides exist
    this.overrides = await tryGetBuildOverrides(language);

    // If they do, ensure the manifest if valid before build starts
    if (this.overrides && this.overrides.validateManifest) {
      await this.overrides.validateManifest(await this.project.getManifest());
    }

    return this.buildSources();
  }
}
