import { BuildStrategy } from "../BuildStrategy";

export class NoopBuildStrategy extends BuildStrategy<void> {
  getStrategyName(): string {
    return "noop";
  }

  buildSources(): Promise<void> {
    return Promise.resolve();
  }

  async build(): Promise<void> {
    return Promise.resolve();
  }
}
