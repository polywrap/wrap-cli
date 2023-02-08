import {
  GenericEnv,
  GenericInterfaceImplementations,
  IGenericUriPackage,
  IGenericUriRedirect,
  IGenericUriWrapper,
  GenericUriResolverLike,
} from "./types";

import { IWrapperCache } from "@polywrap/uri-resolvers-js";
import { TracerConfig } from "@polywrap/tracing-js";
import { Uri } from "@polywrap/core-js";

// $start: PolywrapClientConfig
/**
 * Client configuration that can be passed to the PolywrapClient.
 *
 * @remarks
 * Extends ClientConfig from @polywrap/client-js.
 * The PolywrapClient converts the PolywrapClientConfig to a CoreClientConfig.
 */
export interface PolywrapClientConfig<TUri extends Uri | string = string> {
  /** set environmental variables for a wrapper */
  readonly envs: GenericEnv<TUri>[];

  /** register interface implementations */
  readonly interfaces: GenericInterfaceImplementations<TUri>[];

  /** redirect invocations from one uri to another */
  readonly redirects: IGenericUriRedirect<TUri>[];

  /** add embedded wrappers */
  readonly wrappers: IGenericUriWrapper<TUri>[];

  /** add and configure embedded packages */
  readonly packages: IGenericUriPackage<TUri>[];

  /** customize URI resolution
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect
   *   | IUriPackage
   *   | IUriWrapper
   *   | UriResolverLike<TUri>[]
   *   */
  readonly resolvers: GenericUriResolverLike<TUri>[];
  /** a wrapper cache to be used in place of the default wrapper cache */
  readonly wrapperCache?: IWrapperCache;

  /** configuration for opentelemetry tracing to aid in debugging */
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
// $end
