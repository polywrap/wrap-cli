import { ILogger } from "@polywrap/logging-js";
import { Jobs as OldJobs, PolywrapWorkflow as OldManifest } from "../0.1.0";
import { Jobs as NewJobs, PolywrapWorkflow as NewManifest } from "../0.2.0";

export function migrate(manifest: OldManifest, logger?: ILogger): NewManifest {
  return {
    format: "0.2.0",
    name: manifest.name,
    jobs: sanitizeJobsSteps(manifest.jobs) as NewJobs,
    validation: manifest.validation,

    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "PolywrapWorkflow",
  };
}

function sanitizeJobsSteps(jobs: OldJobs | undefined): NewJobs | undefined {
  if (jobs === undefined) {
    return undefined;
  }

  const oldJobs = JSON.parse(JSON.stringify(jobs)) as OldJobs;
  const newJobs: NewJobs = {};

  for (const job in oldJobs) {
    const jobInfo = oldJobs[job];

    if (jobInfo.steps) {
      newJobs[job].steps = jobInfo.steps.map((x) => {
        // TODO: Warn about config
        return {
          method: x.method,
          uri: x.uri,
          args: x.args,
        };
      });
    }

    newJobs[job].jobs = sanitizeJobsSteps(jobInfo.jobs);
  }

  return newJobs;
}
