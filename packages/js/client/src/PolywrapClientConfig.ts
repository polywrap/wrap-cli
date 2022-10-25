import { Uri } from "@polywrap/core-js";
import { IWrapperCache } from "@polywrap/uri-resolvers-js";
import { TracerConfig } from "@polywrap/tracing-js";
import { ClientConfig } from "@polywrap/client-config-builder-js";

export interface PolywrapClientConfig<TUri extends Uri | string = Uri | string>
  extends ClientConfig<TUri> {
  readonly wrapperCache?: IWrapperCache;
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
