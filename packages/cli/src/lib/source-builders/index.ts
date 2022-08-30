import { SourceBuildArgs, SourceBuildStrategy } from "./SourceBuilder";
import { DockerBuildStrategy } from "./strategies/DockerStrategy";
import { LocalBuildStrategy } from "./strategies/LocalStrategy";

export * from "./SourceBuilder";

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
