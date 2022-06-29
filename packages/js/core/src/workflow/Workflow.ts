import { ClientConfig, Uri } from "..";
import { InvokeResult } from "../invocation/Invoke";
import { MaybeAsync } from "../../utils/MaybeAsync";

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
