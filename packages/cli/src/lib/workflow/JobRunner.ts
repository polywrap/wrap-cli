import { JobResult, Status, Step } from "./types";

import { PolywrapClient } from "@polywrap/client-js";
import { CoreClient, MaybeAsync } from "@polywrap/core-js";
import { WorkflowJobs } from "@polywrap/polywrap-manifest-types-js";
import {
  ClientConfigBuilder,
  ClientConfig,
} from "@polywrap/client-config-builder-js";

export class JobRunner {
  private jobOutput: Map<string, JobResult>;
  private client: CoreClient;

  constructor(
    private clientConfig: Partial<ClientConfig>,
    private onExecution?: (id: string, JobResult: JobResult) => MaybeAsync<void>
  ) {
    this.jobOutput = new Map();
    this.client = new PolywrapClient(this.clientConfig);
  }

  async run(jobs: WorkflowJobs, ids: string[]): Promise<void> {
    const running = ids.map(async (absJobId) => {
      const jobId = this.getJobId(absJobId);

      const steps: Step[] | undefined = jobs[jobId].steps as Step[];
      if (steps) {
        await this.executeSteps(absJobId, steps);
      }

      const subJobs: WorkflowJobs | undefined = jobs[jobId].jobs;
      if (subJobs) {
        const subIds = Object.keys(subJobs).map((sub) => `${absJobId}.${sub}`);
        await this.run(subJobs, subIds);
      }
    });
    await Promise.all(running);
  }

  private getJobId(absJobId: string): string {
    const dotIdx = absJobId.lastIndexOf(".");
    if (dotIdx > -1) {
      return absJobId.substring(dotIdx + 1);
    }
    return absJobId;
  }

  private followAccessors(
    jobResult: JobResult,
    accessors: string[],
    referenceId: string,
    absJobId: string,
    stepId: number
  ): unknown {
    let val = jobResult as unknown;
    for (const [i, accessor] of accessors.entries()) {
      const indexable = val as Record<string, unknown>;
      if (!(accessor in indexable)) {
        const currentRef = referenceId + accessors.slice(0, i).join(".");
        throw new Error(
          `Could not resolve arguments: Property ${accessor} not found in ${currentRef} for step ${absJobId}.${stepId}`
        );
      }
      val = indexable[accessor];
    }
    return val;
  }

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
    const referenceId: string = reference.substring(1, dataOrErrorIdx);
    if (!this.jobOutput.has(referenceId)) {
      throw new Error(
        `Could not resolve reference id ${referenceId} for step ${absJobId}.${stepId}`
      );
    }
    const refJobResult = this.jobOutput.get(referenceId) as JobResult;

    // parse and validate accessors
    const accessors: string[] = reference
      .substring(dataOrErrorIdx + 1)
      .split(".");
    if (refJobResult.status === Status.SKIPPED) {
      throw new Error(
        `Tried to resolve reference to skipped job ${referenceId} for step ${absJobId}.${stepId}`
      );
    } else if (
      accessors[0] === "data" &&
      refJobResult.status === Status.FAILED
    ) {
      throw new Error(
        `Tried to resolve data of failed job ${referenceId} for step ${absJobId}.${stepId}`
      );
    } else if (
      accessors[0] === "error" &&
      refJobResult.status === Status.SUCCEED
    ) {
      throw new Error(
        `Tried to resolve error message of successful job ${referenceId} for step ${absJobId}.${stepId}`
      );
    }

    // follow accessors through reference output to get requested data
    return this.followAccessors(
      refJobResult,
      accessors,
      referenceId,
      absJobId,
      stepId
    );
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
          status: Status.SKIPPED,
        };
      }
    }

    let finalClient = this.client;

    if (step.config) {
      const finalConfig = new ClientConfigBuilder()
        .add(this.clientConfig)
        .add(step.config)
        .build();

      finalClient = new PolywrapClient(finalConfig);
    }

    const invokeResult = await finalClient.invoke({
      uri: step.uri,
      method: step.method,
      args: args,
    });

    if (!invokeResult.ok) {
      return { error: invokeResult.error, status: Status.FAILED };
    } else {
      return { data: invokeResult.value, status: Status.SUCCEED };
    }
  }

  private async executeSteps(absJobId: string, steps: Step[]) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const absId = `${absJobId}.${i}`;

      const result: JobResult = await this.execStep(absJobId, i, step);

      this.jobOutput.set(absId, result);

      if (this.onExecution) {
        await this.onExecution(absId, result);
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
