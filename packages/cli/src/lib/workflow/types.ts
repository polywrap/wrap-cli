import { InvokeResult } from "@polywrap/core-js";
import { WorkflowJobs } from "@polywrap/polywrap-manifest-types-js";

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

export interface JobRunOptions {
  relativeId: string;
  parentId: string;
  jobs: WorkflowJobs;
}
