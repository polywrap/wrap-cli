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

    if (
      fse.existsSync(
        this.project.getCachePath(PolywrapProject.cacheLayout.buildStrategyUsed)
      )
    ) {
      fse.removeSync(
        this.project.getCachePath(PolywrapProject.cacheLayout.buildStrategyUsed)
      );
    }

    fse.mkdirSync(
      this.project.getCachePath(PolywrapProject.cacheLayout.buildStrategyUsed),
      { recursive: true }
    );

    fse.copySync(
      defaultsOfStrategyUsed,
      this.project.getCachePath(PolywrapProject.cacheLayout.buildStrategyUsed)
    );
    return this.buildSources();
  }
}
