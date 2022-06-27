import { ClientConfig, Uri } from ".";
import { InvokeResult } from "./Invoke";
import { MaybeAsync } from "./MaybeAsync";

export type Step<TUri extends Uri | string = string> = {
  uri: TUri;
  method: string;
  args: Record<string, unknown>;
  config?: Partial<ClientConfig>;
};

export type JobInfo<TUri extends Uri | string = string> = {
  steps?: Step<TUri>[];
  jobs?: Job<TUri>;
};

export type Job<TUri extends Uri | string = string> = {
  [name: string]: JobInfo<TUri>;
};

export type Workflow<TUri extends Uri | string = string> = {
  name: string;
  jobs: Job<TUri>;
};

export interface RunOptions<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TUri extends Uri | string = string
> {
  workflow: Workflow<TUri>;
  config?: Partial<ClientConfig>;
  contextId?: string;
  ids?: string[];

  onExecution?(
    id: string,
    data?: InvokeResult<TData>["data"],
    error?: InvokeResult<TData>["error"]
  ): MaybeAsync<void>;
}

export interface WorkflowHandler {
  run<TData extends Record<string, unknown> = Record<string, unknown>>(
    options: RunOptions<TData>
  ): Promise<void>;
}
