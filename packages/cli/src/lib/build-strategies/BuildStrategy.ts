import { PolywrapProject } from "../project";

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

  abstract build(): Promise<TBuildReturn>;
}
