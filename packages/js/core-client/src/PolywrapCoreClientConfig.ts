import { CoreClientConfig, Uri } from "@polywrap/core-js";
import { TracerConfig } from "@polywrap/tracing-js";

export interface PolywrapCoreClientConfig<
  TUri extends Uri | string = Uri | string
> extends CoreClientConfig<TUri> {
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
