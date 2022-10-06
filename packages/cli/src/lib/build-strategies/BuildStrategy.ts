import { PolywrapProject } from "../project";

import fse from "fs-extra";
import path from "path";

export interface BuildStrategyArgs {
  project: PolywrapProject;
  outputDir: string;
}

export abstract class BuildStrategy<TBuildReturn = unknown> {
  protected project: PolywrapProject;
  protected outputDir: string;

  constructor({ project, outputDir }: BuildStrategyArgs) {
    this.project = project;
    this.outputDir = outputDir;
  }

  abstract buildSources(): Promise<TBuildReturn>;

  abstract getStrategyName(): string;

  async build(): Promise<TBuildReturn> {
    const language = await this.project.getManifestLanguage();
    const defaultsOfStrategyUsed = path.join(
      __dirname,
      "..",
      "defaults",
      "build-strategies",
      language,
      this.getStrategyName()
    );
    const strategyUsedCacheDir = this.project.getCachePath(
      PolywrapProject.cacheLayout.buildStrategyUsed
    );

    if (fse.existsSync(strategyUsedCacheDir)) {
      fse.removeSync(strategyUsedCacheDir);
    }

    fse.mkdirSync(strategyUsedCacheDir, { recursive: true });

    fse.copySync(defaultsOfStrategyUsed, strategyUsedCacheDir);
    return this.buildSources();
  }
}
