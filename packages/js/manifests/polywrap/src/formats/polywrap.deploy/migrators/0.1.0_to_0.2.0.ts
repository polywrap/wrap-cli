/* eslint-disable @typescript-eslint/naming-convention */

import { DeployManifest as OldManifest } from "../0.1.0";
import { DeployManifest as NewManifest } from "../0.2.0";

class SequenceTree {
  private nextTrees: SequenceTree[] = [];
  protected input: {
    uri: string;
    config?: unknown;
  };
  protected result: string;

  constructor(
    public name: string,
    public stepInfo: NewManifest["sequences"][number]["steps"][number]
  ) {}

  public addNext(handler: SequenceTree): void {
    this.nextTrees.push(handler);
  }

  public getSteps(): NewManifest["sequences"][number]["steps"] {
    return this.nextTrees.reduce((acc, tree) => {
      return [...acc, tree.stepInfo, ...tree.getSteps()];
    }, [] as NewManifest["sequences"][number]["steps"]);
  }
}

export function migrate(old: OldManifest): NewManifest {
  const manifest: Record<string, unknown> = {
    ...old,
  };

  const trees: Record<string, SequenceTree> = {};
  const roots: SequenceTree[] = [];

  Object.entries(old.stages).forEach(([stageName, stageValue]) => {
    trees[stageName] = new SequenceTree(stageName, {
      name: stageName,
      package: stageValue.package,
      config: stageValue.config,
      uri: stageValue.uri ?? `$${stageValue.depends_on}`,
    });
  });

  Object.entries(old.stages).forEach(([key, value]) => {
    const thisTree = trees[key];

    if (value.depends_on) {
      trees[value.depends_on].addNext(thisTree);
    } else if (value.uri) {
      roots.push(thisTree);
    } else {
      throw new Error(
        `Stage '${key}' needs either previous (depends_on) stage or URI`
      );
    }
  });

  const sequences: NewManifest["sequences"] = [];

  roots.forEach((root) => {
    sequences.push({
      name: root.name,
      steps: root.getSteps(),
    });
  });

  return {
    ...manifest,
    __type: "DeployManifest",
    format: "0.2.0",
    sequences,
  };
}
