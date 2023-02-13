import { Uri } from "@polywrap/core-js";

export interface Step {
  uri: string | Uri;
  method: string;
  args?: {
    [k: string]: unknown;
  };
}

export enum Status {
  SUCCEED = "SUCCEED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export interface JobResult<TData = unknown> {
  data?: TData;
  error?: Error;
  status: Status;
}

export interface WorkflowOutput<TData = unknown> extends JobResult<TData> {
  id: string;
  validation: ValidationResult;
}

export interface ValidationResult {
  status: Status;
  error?: string;
}
