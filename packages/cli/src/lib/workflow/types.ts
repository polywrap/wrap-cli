import { ClientConfig, InvokeResult, Uri } from "@polywrap/core-js";

export interface Step {
  uri: string | Uri;
  method: string;
  args?: {
    [k: string]: unknown;
  };
  config?: ClientConfig;
}

export enum JobStatus {
  SUCCEED = "SUCCEED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export interface JobResult<TData = unknown> extends InvokeResult<TData> {
  status: JobStatus;
}

export interface WorkflowOutput<TData = unknown> extends JobResult<TData> {
  id: string;
}

export interface ValidationResult {
  status: JobStatus;
  stderr?: string;
}
