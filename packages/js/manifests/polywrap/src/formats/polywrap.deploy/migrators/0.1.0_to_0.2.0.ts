/* eslint-disable @typescript-eslint/naming-convention */

import { DeployManifest as OldManifest } from "../0.1.0";
import { DeployManifest as NewManifest } from "../0.2.0";

type Step = NewManifest["sequences"][number]["steps"][number];
type Sequence = NewManifest["sequences"][number];

export function migrate(old: OldManifest): NewManifest {
  const steps: Record<string, Step> = {};
  const sequences: Record<string, Sequence> = {};

  Object.entries(old.stages).forEach(([stageName, stageValue]) => {
    steps[stageName] = {
      name: stageName,
      package: stageValue.package,
      uri: stageValue.uri ?? `$$${stageValue.depends_on}`,
    };

    if (stageValue.config) {
      steps[stageName].config = stageValue.config;
    }
  });

  Object.entries(old.stages).forEach(([stageName, stageValue]) => {
    if (!stageValue.depends_on) {
      sequences[stageName] = {
        name: stageName,
        steps: [steps[stageName]],
      };

      delete steps[stageName];
    }
  });

  while (Object.keys(steps).length > 0) {
    Object.entries(old.stages).forEach(([stageName, stageValue]) => {
      if (stageValue.depends_on) {
        if (sequences[stageValue.depends_on]) {
          sequences[stageValue.depends_on].steps.push(steps[stageName]);
          delete steps[stageName];
        } else {
          Object.values(sequences).forEach((sequenceValue) => {
            if (
              sequenceValue.steps.some(
                (step) => step.name === stageValue.depends_on
              )
            ) {
              sequenceValue.steps.push(steps[stageName]);
              delete steps[stageName];
            }
          });
        }
      }
    });
  }

  return {
    __type: "DeployManifest",
    format: "0.2.0",
    sequences: Object.values(sequences),
  };
}
