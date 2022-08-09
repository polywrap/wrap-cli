import { ClientConfig } from ".";
import { InvokeResult } from "./Invoke";
import { MaybeAsync } from "./MaybeAsync";

import { PolywrapWorkflow } from "@polywrap/workflow-manifest-types-js";

export enum JobStatus {
  SUCCEED = "SUCCEED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export interface JobResult<TData extends unknown = unknown>
  extends InvokeResult<TData> {
  status: JobStatus;
}

export interface RunOptions<
  TData extends Record<string, unknown> = Record<string, unknown>
> {
  workflow: PolywrapWorkflow;
  config?: Partial<ClientConfig>;
  contextId?: string;
  ids?: string[];

  onExecution?(id: string, jobResult: JobResult<TData>): MaybeAsync<void>;
}

export interface WorkflowHandler {
  run<TData extends Record<string, unknown> = Record<string, unknown>>(
    options: RunOptions<TData>
  ): Promise<void>;
}
