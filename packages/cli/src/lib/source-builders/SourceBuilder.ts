import { CompilerOverrides } from "../Compiler";
import { PolywrapProject } from "../project";
import { LocalBuildStrategy } from "./strategies/LocalStrategy";
import { DockerBuildStrategy } from "./strategies/DockerStrategy";

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

  abstract getCompilerOverrides(): Promise<CompilerOverrides | undefined>;
  abstract build(): Promise<TBuildReturn>;
}

export function createSourceBuildStrategy(
  type: "docker" | "local",
  args: SourceBuildArgs
): SourceBuildStrategy {
  switch (type) {
    case "docker":
      return new DockerBuildStrategy(args);
    case "local":
      return new LocalBuildStrategy(args);
    default:
      throw new Error(`Unknown build strategy type: ${type}`);
  }
}
