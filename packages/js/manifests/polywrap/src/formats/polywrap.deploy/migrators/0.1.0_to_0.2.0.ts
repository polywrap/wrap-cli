/* eslint-disable @typescript-eslint/naming-convention */

import { DeployManifest as OldManifest } from "../0.1.0";
import { DeployManifest as NewManifest } from "../0.2.0";

type Step = NewManifest["sequences"][number]["steps"][number];
type Sequence = NewManifest["sequences"][number];

export function migrate(old: OldManifest): NewManifest {
  const steps: Record<string, Step> = {};
  const sequences: Record<
    string,
    Omit<Sequence, "steps"> & { steps: Record<string, Step> }
  > = {};

  const stageEntries = Object.entries(old.stages);

  stageEntries.forEach(([stageName, stageValue]) => {
    steps[stageName] = {
      name: stageName,
      package: stageValue.package,
      uri: stageValue.uri ?? `$$${stageValue.depends_on}`,
    };

    if (stageValue.config) {
      steps[stageName].config = stageValue.config;
    }
  });

  stageEntries.forEach(([stageName, stageValue]) => {
    if (!stageValue.depends_on) {
      sequences[stageName] = {
        name: stageName,
        steps: {
          [stageName]: steps[stageName],
        },
      };

      delete steps[stageName];
    }
  });

  while (Object.keys(steps).length > 0) {
    const sequenceValues = Object.values(sequences);
    stageEntries
      .filter(([_, stageValue]) => !!stageValue.depends_on)
      .forEach(([stageName, stageValue]) => {
        if (sequences[stageValue.depends_on as string]) {
          sequences[stageValue.depends_on as string].steps[stageName] =
            steps[stageName];
          delete steps[stageName];
        } else {
          sequenceValues.forEach((sequenceValue) => {
            if (sequenceValue.steps[stageValue.depends_on as string]) {
              sequenceValue.steps[stageName] = steps[stageName];
              delete steps[stageName];
            }
          });
        }
      });
  }

  return {
    __type: "DeployManifest",
    format: "0.2.0",
    sequences: Object.values(sequences).map((sequence) => ({
      ...sequence,
      steps: Object.values(sequence.steps),
    })),
  };
}
