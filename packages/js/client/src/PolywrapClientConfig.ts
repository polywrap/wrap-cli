import { Uri } from "@polywrap/core-js";
import { IWrapperCache } from "@polywrap/uri-resolvers-js";
import { TracerConfig } from "@polywrap/tracing-js";
import { ClientConfig } from "@polywrap/client-config-builder-js";

/**
 * Client configuration that can be passed to the PolywrapClient.
 *
 * @remarks
 * Extends ClientConfig from @polywrap/client-config-builder-js.
 * The PolywrapClient converts the PolywrapClientConfig to a CoreClientConfig.
 */
export interface PolywrapClientConfig<TUri extends Uri | string = Uri | string>
  extends ClientConfig<TUri> {
  /** a wrapper cache to be used in place of the default wrapper cache */
  readonly wrapperCache?: IWrapperCache;

  /** configuration for opentelemetry tracing to aid in debugging */
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
