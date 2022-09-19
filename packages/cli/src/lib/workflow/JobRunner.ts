import { JobResult, JobStatus, Step } from "./types";

import {
  Client,
  executeMaybeAsyncFunction,
  MaybeAsync,
} from "@polywrap/core-js";
import { WorkflowJobs } from "@polywrap/polywrap-manifest-types-js";

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

  // private resolveReference(
  //   absCurJobId: string,
  //   curStepId: number,
  //   value: string
  // ): unknown {
  //   const absStepIdArr = value.slice(1).split(".");
  //   const absJobId = absStepIdArr.slice(0, absStepIdArr.length - 2).join(".");
  //   const dataOrErr: DataOrError = absStepIdArr[
  //     absStepIdArr.length - 1
  //   ] as DataOrError;
  //   const absStepId = `${absJobId}.${absStepIdArr[absStepIdArr.length - 2]}`;
  //
  //   if (absCurJobId.includes(absJobId)) {
  //     if (absJobId === absCurJobId) {
  //       if (+absStepIdArr[absStepIdArr.length - 2] < curStepId) {
  //         const output = this.jobOutput.get(absStepId);
  //         if (output && output[dataOrErr]) {
  //           return output[dataOrErr];
  //         }
  //       }
  //     }
  //     const output = this.jobOutput.get(absStepId);
  //     if (
  //       output &&
  //       dataOrErr === "data" &&
  //       output.status === JobStatus.SUCCEED &&
  //       output.data
  //     ) {
  //       return output.data;
  //     }
  //     if (
  //       output &&
  //       dataOrErr === "error" &&
  //       output.status === JobStatus.FAILED &&
  //       output.error
  //     ) {
  //       return output.error;
  //     }
  //   }
  //
  //   throw new Error(
  //     `Could not resolve arguments for step with stepId: ${absCurJobId}.${curStepId}`
  //   );
  // }

  private resolveReference(
    absJobId: string,
    stepId: number,
    reference: string
  ): unknown {
    // get numerical index of property accessors
    let dataOrErrorIdx = reference.indexOf(".data");
    if (dataOrErrorIdx < 0) {
      dataOrErrorIdx = reference.indexOf(".error");
      if (dataOrErrorIdx < 0) {
        throw new Error(
          `Could not find 'data' or 'error' properties in reference ${reference} for step ${absJobId}.${stepId}`
        );
      }
    }

    // get reference job output
    const absReferenceId: string = reference.substring(1, dataOrErrorIdx);
    if (!this.jobOutput.has(absReferenceId)) {
      throw new Error(
        `Could not resolve reference id ${absReferenceId} for step ${absJobId}.${stepId}`
      );
    }
    const refJobResult = this.jobOutput.get(absReferenceId) as JobResult;

    // parse and validate accessors
    const accessors: string[] = reference
      .substring(dataOrErrorIdx + 1)
      .split(".");
    if (refJobResult.status === JobStatus.SKIPPED) {
      throw new Error(
        `Tried to resolve reference to skipped job ${absReferenceId} for step ${absJobId}.${stepId}`
      );
    } else if (
      accessors[0] === "data" &&
      refJobResult.status === JobStatus.FAILED
    ) {
      throw new Error(
        `Tried to resolve data of failed job ${absReferenceId} for step ${absJobId}.${stepId}`
      );
    } else if (
      accessors[0] === "error" &&
      refJobResult.status === JobStatus.SUCCEED
    ) {
      throw new Error(
        `Tried to resolve error message of successful job ${absReferenceId} for step ${absJobId}.${stepId}`
      );
    }

    // follow accessors to get requested data
    let val = refJobResult as unknown;
    for (const [i, accessor] of accessors.entries()) {
      const indexable = val as Record<string, unknown>;
      if (!(accessor in indexable)) {
        const currentRef = absReferenceId + accessors.slice(0, i).join(".");
        throw new Error(
          `Could not resolve arguments: Property ${accessor} not found in ${currentRef} for step ${absJobId}.${stepId}`
        );
      }
      val = indexable[accessor];
    }

    return val;
  }

  private resolveRecord(
    absJobId: string,
    stepId: number,
    record: Record<string, unknown>
  ): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      resolved[key] = this.resolveValue(absJobId, stepId, value);
    }
    return resolved;
  }

  private resolveArray(
    absJobId: string,
    stepId: number,
    array: Array<unknown>
  ): Array<unknown> {
    return array.map((v) => this.resolveValue(absJobId, stepId, v));
  }

  private resolveValue(
    absJobId: string,
    stepId: number,
    value: unknown
  ): unknown {
    if (this.isReference(value)) {
      return this.resolveReference(absJobId, stepId, value);
    } else if (Array.isArray(value)) {
      return this.resolveArray(absJobId, stepId, value);
    } else if (this.isRecord(value)) {
      return this.resolveRecord(absJobId, stepId, value);
    } else {
      return value;
    }
  }

  private async execStep(
    absJobId: string,
    stepId: number,
    step: Step
  ): Promise<JobResult> {
    let args: Record<string, unknown> | undefined;
    if (step.args) {
      try {
        args = this.resolveRecord(absJobId, stepId, step.args);
      } catch (e) {
        return {
          error: e,
          status: JobStatus.SKIPPED,
        };
      }
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
      const absJobId = parentId ? `${parentId}.${jobId}` : `${jobId}`;
      const absId = `${absJobId}.${i}`;

      const result: JobResult = await this.execStep(absJobId, i, step);

      this.jobOutput.set(absId, result);

      if (this.onExecution) {
        await executeMaybeAsyncFunction(this.onExecution, absId, result);
      }
    }
  }

  private isReference(value: unknown): value is string {
    return typeof value === "string" && value.startsWith("$");
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }
}
