/* eslint-disable @typescript-eslint/naming-convention */

import { DeployManifest as OldManifest } from "../0.1.0";
import { DeployManifest as NewManifest } from "../0.2.0";

type Step = NewManifest["jobs"][number]["steps"][number];
type Job = NewManifest["jobs"][number];

export function migrate(old: OldManifest): NewManifest {
  const steps: Record<string, Step> = {};
  const jobs: Record<
    string,
    Omit<Job, "steps"> & { steps: Record<string, Step>; name: string }
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
      jobs[stageName] = {
        name: stageName,
        steps: {
          [stageName]: steps[stageName],
        },
      };

      delete steps[stageName];
    }
  });

  while (Object.keys(steps).length > 0) {
    const jobValues = Object.values(jobs);
    stageEntries
      .filter(([_, stageValue]) => !!stageValue.depends_on)
      .forEach(([stageName, stageValue]) => {
        if (jobs[stageValue.depends_on as string]) {
          jobs[stageValue.depends_on as string].steps[stageName] =
            steps[stageName];
          delete steps[stageName];
        } else {
          jobValues.forEach((jobValue) => {
            if (jobValue.steps[stageValue.depends_on as string]) {
              jobValue.steps[stageName] = steps[stageName];
              delete steps[stageName];
            }
          });
        }
      });
  }

  return {
    __type: "DeployManifest",
    format: "0.2.0",
    jobs: Object.fromEntries(
      Object.values(jobs).map((job) => [
        job.name,
        {
          config: job.config,
          steps: Object.values(job.steps),
        },
      ])
    ),
  };
}
