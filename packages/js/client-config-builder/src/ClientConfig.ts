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
 */
export interface ClientConfig<TUri extends Uri | string = Uri | string> {
  readonly envs: Env<TUri>[];
  readonly interfaces: InterfaceImplementations<TUri>[];
  readonly redirects: IUriRedirect<TUri>[];
  readonly wrappers: IUriWrapper<TUri>[];
  readonly packages: IUriPackage<TUri>[];
  readonly resolvers: UriResolverLike[];
}
