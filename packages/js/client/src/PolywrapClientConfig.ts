import { Uri } from "@polywrap/core-js";
import { IWrapperCache } from "@polywrap/uri-resolvers-js";
import { TracerConfig } from "@polywrap/tracing-js";
import { ClientConfig } from "@polywrap/client-config-builder-js";

/**
 * Client configuration that can be passed to the PolywrapClient.
 * Extends ClientConfig from @polywrap/client-config-builder-js.
 *
 * @remarks
 * The PolywrapClient converts the PolywrapClientConfig to a CoreClientConfig.
 * A UriResolverLike can be any one of:
 *     IUriResolver<unknown>
 *   | IUriRedirect<Uri | string>
 *   | IUriPackage<Uri | string>
 *   | IUriWrapper<Uri | string>
 *   | UriResolverLike[];
 *
 * @property envs - set environmental variables for a wrapper
 * @property interfaces - register interface implementations
 * @property redirects - redirect invocations from one uri to another
 * @property wrappers - add embedded wrappers
 * @property packages - add and configure embedded packages
 * @property resolvers - customize URI resolution
 *
 * @property wrapperCache? - a wrapper cache to be used in place of the default wrapper cache
 * @property tracerConfig? - configuration for opentelemetry tracing to aid in debugging
 */
export interface PolywrapClientConfig<TUri extends Uri | string = Uri | string>
  extends ClientConfig<TUri> {
  readonly wrapperCache?: IWrapperCache;
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
