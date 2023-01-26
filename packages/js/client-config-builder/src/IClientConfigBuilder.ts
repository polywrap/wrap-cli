import { ClientConfig } from "./ClientConfig";

import {
  CoreClientConfig,
  Uri,
  IUriPackage,
  IUriWrapper,
  Env,
  IUriRedirect,
} from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface IClientConfigBuilder {
  // $start: IClientConfigBuilder-build
  /**
   * Build a sanitized client configuration that can be passed to the PolywrapClient constructor
   *
   * @returns ClientConfig<Uri> that results from applying all the steps in the builder pipeline
   */
  build(): ClientConfig<Uri>;
  // $end

  // $start: IClientConfigBuilder-buildCoreConfig
  /**
   * Build a sanitized core client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors
   *
   * @returns CoreClientConfig<Uri> that results from applying all the steps in the builder pipeline
   */
  buildCoreConfig(): CoreClientConfig<Uri>;
  // $end

  // $start: IClientConfigBuilder-add
  /**
   * Add a partial ClientConfig
   * This is equivalent to calling each of the plural add functions: `addEnvs`, `addWrappers`, etc.
   *
   * @param config: a partial CliengConfig
   * @returns IClientConfigBuilder (mutated self)
   */
  add(config: Partial<ClientConfig>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addDefaults
  /**
   * Add the default configuration bundle
   *
   * @returns IClientConfigBuilder (mutated self)
   */
  addDefaults(): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addWrapper
  /**
   * Add an embedded wrapper
   *
   * @param uriWrapper: a wrapper and its URI
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrapper(uriWrapper: IUriWrapper<Uri | string>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addWrappers
  /**
   * Add one or more embedded wrappers.
   * This is equivalent to calling addWrapper for each wrapper.
   *
   * @param uriWrappers: a list of wrappers and their URIs
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrappers(uriWrappers: IUriWrapper<Uri | string>[]): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removeWrapper
  /**
   * Remove an embedded wrapper
   *
   * @param uri: the wrapper's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removeWrapper(uri: Uri | string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addPackage
  /**
   * Add an embedded wrap package
   *
   * @param uriPackage: a package and its URI
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackage(uriPackage: IUriPackage<Uri | string>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addPackages
  /**
   * Add one or more embedded wrap packages
   * This is equivalent to calling addPackage for each package
   *
   * @param uriPackages: a list of packages and their URIs
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackages(uriPackages: IUriPackage<Uri | string>[]): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removePackage
  /**
   * Remove an embedded wrap package
   *
   * @param uri: the package's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removePackage(uri: Uri | string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addEnv
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is modified.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: a string-index map of msgpack-serializable environmental variables
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnv(uri: Uri | string, env: Record<string, unknown>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addEnvs
  /**
   * Add one or more Envs
   * This is equivalent to calling addEnv for each Env
   *
   * @param envs: a list of Envs
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnvs(envs: Env<Uri | string>[]): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removeEnv
  /**
   * Remove an Env
   *
   * @param uri: the URI associated with the Env
   * @returns IClientConfigBuilder (mutated self)
   */
  removeEnv(uri: Uri | string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-setEnv
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is replaced.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: a string-index map of msgpack-serializable environmental variables
   * @returns IClientConfigBuilder (mutated self)
   */
  setEnv(uri: Uri | string, env: Record<string, unknown>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addInterfaceImplementation
  /**
   * Register an implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUri: the URI of the implementation
   * @returns IClientConfigBuilder (mutated self)
   */
  addInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addInterfaceImplementations
  /**
   * Register one or more implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUris: a list of URIs for the implementations
   * @returns IClientConfigBuilder (mutated self)
   */
  addInterfaceImplementations(
    interfaceUri: Uri | string,
    implementationUris: Array<Uri | string>
  ): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removeInterfaceImplementation
  /**
   * Remove an implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUri: the URI of the implementation
   * @returns IClientConfigBuilder (mutated self)
   */
  removeInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addRedirect
  /**
   * Add a redirect from one URI to another
   *
   * @param from: the URI to redirect from
   * @param to: the URI to redirect to
   * @returns IClientConfigBuilder (mutated self)
   */
  addRedirect(from: Uri | string, to: Uri | string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addRedirects
  /**
   * Add an array of URI redirects
   *
   * @param redirects: a list of URI redirects
   * @returns IClientConfigBuilder (mutated self)
   */
  addRedirects(redirects: IUriRedirect<Uri | string>[]): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removeRedirect
  /**
   * Remove a URI redirect
   *
   * @param from: the URI that is being redirected
   * @returns IClientConfigBuilder (mutated self)
   */
  removeRedirect(from: Uri | string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addResolver
  /**
   * Add a URI Resolver, capable of resolving a URI to a wrapper
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<Uri | string>
   *   | IUriPackage<Uri | string>
   *   | IUriWrapper<Uri | string>
   *   | UriResolverLike[];
   *
   * @param resolver: A UriResolverLike
   * @returns IClientConfigBuilder (mutated self)
   */
  addResolver(resolver: UriResolverLike): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addResolvers
  /**
   * Add one or more URI Resolvers, capable of resolving URIs to wrappers
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<Uri | string>
   *   | IUriPackage<Uri | string>
   *   | IUriWrapper<Uri | string>
   *   | UriResolverLike[];
   *
   * @param resolvers: A list of UriResolverLike
   * @returns IClientConfigBuilder (mutated self)
   */
  addResolvers(resolvers: UriResolverLike[]): IClientConfigBuilder;
  // $end
}
