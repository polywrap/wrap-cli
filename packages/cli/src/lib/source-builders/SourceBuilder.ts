import { PolywrapProject } from "../project";

export interface SourceBuildArgs {
  project: PolywrapProject;
  outputDir: string;
}

export abstract class SourceBuildStrategy<TBuildReturn = unknown> {
  protected project: PolywrapProject;
  protected outputDir: string;

  constructor({ project, outputDir }: SourceBuildArgs) {
    this.project = project;
    this.outputDir = outputDir;
  }

  abstract build(): Promise<TBuildReturn>;
}
