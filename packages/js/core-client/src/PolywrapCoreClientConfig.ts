import { CoreClientConfig, Uri } from "@polywrap/core-js";
import { TracerConfig } from "@polywrap/tracing-js";

/**
 * Core Client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors.
 *
 * @remarks
 * Extends CoreClientConfig from @polywrap/core-js.
 * The PolywrapClient and PolywrapCoreClient convert the PolywrapCoreClientConfig to a CoreClientConfig.
 */
export interface PolywrapCoreClientConfig<
  TUri extends Uri | string = Uri | string
> extends CoreClientConfig<TUri> {
  /** configuration for opentelemetry tracing to aid in debugging */
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
