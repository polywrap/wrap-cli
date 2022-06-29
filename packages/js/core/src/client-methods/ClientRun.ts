import {
  Uri,
  Workflow,
  ClientConfig,
  InvokeResult,
  MaybeAsync
} from ".";

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

export interface ClientRunWorkflow {
  run<
    TData extends Record<string, unknown> = Record<string, unknown>
  >(
    options: RunOptions<TData>
  ): Promise<void>;
}
