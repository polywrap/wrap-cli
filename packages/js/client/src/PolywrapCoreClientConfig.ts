import { ClientConfig, Uri } from "@polywrap/core-js";
import { TracerConfig } from "@polywrap/tracing-js";

export interface PolywrapCoreClientConfig<
  TUri extends Uri | string = Uri | string
> extends ClientConfig<TUri> {
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
