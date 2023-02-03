import {
  Env,
  InterfaceImplementations,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

// $start: ClientConfig
/**
 * Client configuration that can be passed to the PolywrapClient
 *
 * @remarks
 * The PolywrapClient converts the ClientConfig to a CoreClientConfig.
 */
export interface ClientConfig {
  /** set environmental variables for a wrapper */
  readonly envs: Env[];

  /** register interface implementations */
  readonly interfaces: InterfaceImplementations[];

  /** redirect invocations from one uri to another */
  readonly redirects: IUriRedirect[];

  /** add embedded wrappers */
  readonly wrappers: IUriWrapper[];

  /** add and configure embedded packages */
  readonly packages: IUriPackage[];

  /** customize URI resolution
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect
   *   | IUriPackage
   *   | IUriWrapper
   *   | UriResolverLike[]
   *   */
  readonly resolvers: UriResolverLike[];
}
// $end
