import { JobResult, JobStatus, Step } from "./types";

import {
  Client,
  executeMaybeAsyncFunction,
  MaybeAsync,
} from "@polywrap/core-js";
import { WorkflowJobs } from "@polywrap/polywrap-manifest-types-js";

type DataOrError = "data" | "error";

export interface JobRunOptions {
  relativeId?: string;
  parentId?: string;
  jobs: WorkflowJobs;
}

export class JobRunner {
  private jobOutput: Map<string, JobResult>;

  constructor(
    private client: Client,
    private onExecution?: (id: string, JobResult: JobResult) => MaybeAsync<void>
  ) {
    this.jobOutput = new Map();
  }

  async run(jobs: WorkflowJobs, ids?: string[]): Promise<void> {
    ids = ids ? ids : Object.keys(jobs);
    const running = ids.map((relativeId) => this._run({ relativeId, jobs }));
    await Promise.all(running);
  }

  private async _run(opts: JobRunOptions): Promise<void> {
    const { relativeId, parentId, jobs } = opts;

    if (relativeId) {
      let index = relativeId.indexOf(".");
      index = index === -1 ? relativeId.length : index;

      const jobId = relativeId.substring(0, index);
      if (jobId === "") return;

      const steps: Step[] | undefined = jobs[jobId].steps as Step[];
      if (steps) {
        await this.executeSteps(jobId, steps, parentId);
      }

      const subJobs: WorkflowJobs | undefined = jobs[jobId].jobs;
      if (subJobs) {
        await this._run({
          relativeId: relativeId.substring(index + 1),
          parentId: parentId ? `${parentId}.${jobId}` : jobId,
          jobs: subJobs,
        });
      }
    } else {
      const jobIds = Object.keys(jobs);
      // Run all the sibling jobs in parallel
      await Promise.all(
        jobIds.map((relativeId) => this._run({ relativeId, parentId, jobs }))
      );
    }
  }

  private resolveArgs(
    absCurStepId: string,
    args: Record<string, unknown> | undefined
  ): Record<string, unknown> {
    const index = absCurStepId.lastIndexOf(".");
    const curStepId = +absCurStepId.substring(index + 1);
    const absCurJobId = absCurStepId.substring(0, index);
    const outputs = this.jobOutput;

    function resolveValue(value: unknown): unknown {
      if (typeof value === "string" && value.startsWith("$")) {
        const absStepIdArr = value.slice(1).split(".");
        const absJobId = absStepIdArr
          .slice(0, absStepIdArr.length - 2)
          .join(".");
        const dataOrErr: DataOrError = absStepIdArr[
          absStepIdArr.length - 1
        ] as DataOrError;
        const absStepId = `${absJobId}.${
          absStepIdArr[absStepIdArr.length - 2]
        }`;

        if (absCurJobId.includes(absJobId)) {
          if (absJobId === absCurJobId) {
            if (+absStepIdArr[absStepIdArr.length - 2] < curStepId) {
              const output = outputs.get(absStepId);
              if (output && output[dataOrErr]) {
                return output[dataOrErr];
              }
            }
          }
          const output = outputs.get(absStepId);
          if (
            output &&
            dataOrErr === "data" &&
            output.status === JobStatus.SUCCEED &&
            output.data
          ) {
            return output.data;
          }
          if (
            output &&
            dataOrErr === "error" &&
            output.status === JobStatus.FAILED &&
            output.error
          ) {
            return output.error;
          }
        }

        throw new Error(
          `Could not resolve arguments for step with stepId: ${absCurJobId}.${curStepId}`
        );
      } else if (Array.isArray(value)) return value.map(resolveValue);
      else if (typeof value === "object" && value !== null) {
        return Object.entries(value as Record<string, unknown>).reduce(
          (obj, [k, v]) => ((obj[k] = resolveValue(v)), obj),
          {} as Record<string, unknown>
        );
      } else return value;
    }

    return args
      ? (resolveValue(args) as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  }

  private async execStep(absId: string, step: Step): Promise<JobResult> {
    let args: Record<string, unknown> | undefined;
    try {
      args = this.resolveArgs(absId, step.args);
    } catch (e) {
      return {
        error: e,
        status: JobStatus.SKIPPED,
      };
    }

    const invokeResult = await this.client.invoke({
      uri: step.uri,
      method: step.method,
      config: step.config,
      args: args,
    });

    if (invokeResult.error) {
      return { ...invokeResult, status: JobStatus.FAILED };
    } else {
      return { ...invokeResult, status: JobStatus.SUCCEED };
    }
  }

  private async executeSteps(jobId: string, steps: Step[], parentId?: string) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const absId = parentId ? `${parentId}.${jobId}.${i}` : `${jobId}.${i}`;

      const result: JobResult = await this.execStep(absId, step);

      this.jobOutput.set(absId, result);

      if (this.onExecution && typeof this.onExecution === "function") {
        await executeMaybeAsyncFunction(this.onExecution, absId, result);
      }
    }
  }
}
