import { CoreClientConfig, Uri } from "@polywrap/core-js";
import { TracerConfig } from "@polywrap/tracing-js";

/**
 * Core Client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors.
 * Extends CoreClientConfig from @polywrap/core-js.
 *
 * @remarks
 * The PolywrapClient and PolywrapCoreClient convert the PolywrapCoreClientConfig to a CoreClientConfig.
 * A UriResolverLike can be any one of:
 *     IUriResolver<unknown>
 *   | IUriRedirect<Uri | string>
 *   | IUriPackage<Uri | string>
 *   | IUriWrapper<Uri | string>
 *   | UriResolverLike[];
 *
 * @property envs - set environmental variables for a wrapper
 * @property interfaces - register interface implementations
 * @property resolver - configure URI resolution for redirects, packages, and wrappers
 *
 * @property tracerConfig? - configuration for opentelemetry tracing to aid in debugging
 */
export interface PolywrapCoreClientConfig<
  TUri extends Uri | string = Uri | string
> extends CoreClientConfig<TUri> {
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
