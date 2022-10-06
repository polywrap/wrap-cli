import { CustomClientConfig } from "@polywrap/client-config-builder-js";
import { Uri } from "@polywrap/core-js";

export interface Step {
  uri: string | Uri;
  method: string;
  args?: {
    [k: string]: unknown;
  };
  config?: CustomClientConfig<Uri | string>;
}

export enum JobStatus {
  SUCCEED = "SUCCEED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export interface JobResult<TData = unknown> {
  data?: TData;
  error?: Error;
  status: JobStatus;
}

export interface WorkflowOutput<TData = unknown> extends JobResult<TData> {
  id: string;
}

export interface ValidationResult {
  status: JobStatus;
  stderr?: string;
}
