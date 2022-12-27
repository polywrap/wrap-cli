import {
  Uri,
  Env,
  InterfaceImplementations,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

/**
 * Client configuration that can be passed to the PolywrapClient
 *
 * @remarks
 * The PolywrapClient converts the ClientConfig to a CoreClientConfig.
 */
export interface ClientConfig<TUri extends Uri | string = Uri | string> {
  /** set environmental variables for a wrapper */
  readonly envs: Env<TUri>[];

  /** redirect invocations from one uri to another */
  readonly interfaces: InterfaceImplementations<TUri>[];

  /** register interface implementations */
  readonly redirects: IUriRedirect<TUri>[];

  /** add embedded wrappers */
  readonly wrappers: IUriWrapper<TUri>[];

  /** add and configure embedded packages */
  readonly packages: IUriPackage<TUri>[];

  /** customize URI resolution
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<Uri | string>
   *   | IUriPackage<Uri | string>
   *   | IUriWrapper<Uri | string>
   *   | UriResolverLike[]
   *   */
  readonly resolvers: UriResolverLike[];
}
