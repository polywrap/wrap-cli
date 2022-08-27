import {
  Client,
  executeMaybeAsyncFunction,
  MaybeAsync,
  Uri,
  InvokeResult,
} from "@polywrap/core-js";
import { WorkflowJobs } from "@polywrap/polywrap-manifest-types-js";

export enum JobStatus {
  SUCCEED = "SUCCEED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export interface JobResult<TData extends unknown = unknown>
  extends InvokeResult<TData> {
  status: JobStatus;
}

export interface JobRunOptions {
  relativeId: string;
  parentId: string;
  jobs: WorkflowJobs;
}

type DataOrError = "data" | "error";

export class JobRunner<
  TData extends unknown = unknown,
  TUri extends Uri | string = string
> {
  private jobOutput: Map<string, JobResult<TData>>;

  constructor(
    private client: Client,
    private onExecution?: (
      id: string,
      JobResult: JobResult<TData>
    ) => MaybeAsync<void>
  ) {
    this.jobOutput = new Map();
  }

  async run(opts: JobRunOptions): Promise<void> {
    const { relativeId, parentId, jobs } = opts;

    if (relativeId) {
      let index = relativeId.indexOf(".");
      index = index === -1 ? relativeId.length : index;

      const jobId = relativeId.substring(0, index);
      if (jobId === "") return;

      const steps = jobs[jobId].steps;
      if (steps) {
        for (let i = 0; i < steps.length; i++) {
          let result: JobResult<TData> | undefined;
          let args: Record<string, unknown> | undefined;

          const step = steps[i];
          const absoluteId = parentId
            ? `${parentId}.${jobId}.${i}`
            : `${jobId}.${i}`;
          try {
            args = this.resolveArgs(absoluteId, step.args);
          } catch (e) {
            result = {
              error: e,
              status: JobStatus.SKIPPED,
            };
          }

          if (args) {
            const client = step.config
              ? this.client.reconfigure(step.config)
              : this.client;

            const invokeResult = await client.invoke<TData, TUri>({
              uri: step.uri,
              method: step.method,
              args: args,
            });

            if (invokeResult.error) {
              result = { ...invokeResult, status: JobStatus.FAILED };
            } else {
              result = { ...invokeResult, status: JobStatus.SUCCEED };
            }
          }

          if (result) {
            this.jobOutput.set(absoluteId, result);

            if (this.onExecution && typeof this.onExecution === "function") {
              await executeMaybeAsyncFunction(
                this.onExecution,
                absoluteId,
                result
              );
            }
          }
        }
      }
      const subJobs = jobs[jobId].jobs;
      if (subJobs) {
        await this.run({
          relativeId: relativeId.substring(index + 1),
          parentId: parentId ? `${parentId}.${jobId}` : jobId,
          jobs: subJobs,
        });
      }
    } else {
      const jobIds = Object.keys(jobs);
      // Run all the sibling jobs in parallel
      await Promise.all(
        jobIds.map((jobId) =>
          this.run({
            relativeId: jobId,
            parentId,
            jobs: jobs,
          })
        )
      );
    }
  }

  resolveArgs(
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
}
