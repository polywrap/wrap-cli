import { ILogger } from "@polywrap/logging-js";
import { Jobs as OldJobs, PolywrapWorkflow as OldManifest } from "../0.1.0";
import { Jobs as NewJobs, PolywrapWorkflow as NewManifest } from "../0.2.0";

export function migrate(manifest: OldManifest, logger?: ILogger): NewManifest {
  const [jobsSanitized, jobsHaveStepsWithConfig] = sanitizeJobsSteps(
    manifest.jobs
  );

  if (jobsHaveStepsWithConfig) {
    logger?.warn(
      "One or more of the steps in your test manifest have a config property. This is no longer supported, and will be removed."
    );
  }

  return {
    format: "0.2.0",
    name: manifest.name,
    jobs: jobsSanitized as NewJobs,
    validation: manifest.validation,

    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "PolywrapWorkflow",
  };
}

function sanitizeJobsSteps(
  jobs: OldJobs | undefined
): [NewJobs | undefined, boolean] {
  if (jobs === undefined) {
    return [undefined, false];
  }

  const oldJobs = JSON.parse(JSON.stringify(jobs)) as OldJobs;
  const newJobs: NewJobs = {};
  let jobHasStepsWithConfig = false;

  for (const job in oldJobs) {
    const jobInfo = oldJobs[job];

    if (jobInfo.steps) {
      newJobs[job] = {};
      newJobs[job].steps = jobInfo.steps.map((x) => {
        if (x.config) {
          jobHasStepsWithConfig = true;
        }

        return {
          method: x.method,
          uri: x.uri,
          args: x.args,
        };
      });
    }

    let innerJobsHaveStepsWithConfig = false;

    [newJobs[job].jobs, innerJobsHaveStepsWithConfig] = sanitizeJobsSteps(
      jobInfo.jobs
    );

    jobHasStepsWithConfig =
      jobHasStepsWithConfig || innerJobsHaveStepsWithConfig;
  }

  return [newJobs, jobHasStepsWithConfig];
}
