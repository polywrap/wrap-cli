import { BuildStrategy } from "../BuildStrategy";

export class EmptyBuildStrategy extends BuildStrategy<void> {
  getStrategyName(): string {
    return "empty";
  }

  public async buildSources(): Promise<void> {}
}
