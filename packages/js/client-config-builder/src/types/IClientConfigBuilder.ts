import { BuilderConfig } from "./configs/BuilderConfig";

import { CoreClientConfig, Wrapper, IWrapPackage } from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface IClientConfigBuilder {
  config: BuilderConfig;

  // $start: IClientConfigBuilder-build
  /**
   * Build a sanitized core client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors
   *
   * @returns CoreClientConfig that results from applying all the steps in the builder pipeline
   */
  build(): CoreClientConfig;
  // $end

  // $start: IClientConfigBuilder-add
  /**
   * Add a partial BuilderConfig
   * This is equivalent to calling each of the plural add functions: `addEnvs`, `addWrappers`, etc.
   *
   * @param config: a partial BuilderConfig
   * @returns IClientConfigBuilder (mutated self)
   */
  add(config: Partial<BuilderConfig>): IClientConfigBuilder;
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
   * @param uri: uri of wrapper
   * @param wrapper: wrapper to be added
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrapper(uri: string, wrapper: Wrapper): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addWrappers
  /**
   * Add one or more embedded wrappers.
   * This is equivalent to calling addWrapper for each wrapper.
   *
   * @param uriWrappers: an object where keys are uris and wrappers are value
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrappers(uriWrappers: Record<string, Wrapper>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removeWrapper
  /**
   * Remove an embedded wrapper
   *
   * @param uri: the wrapper's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removeWrapper(uri: string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addPackage
  /**
   * Add an embedded wrap package
   *
   * @param uri: uri of wrapper
   * @param wrapPackage: package to be added
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackage(uri: string, wrapPackage: IWrapPackage): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addPackages
  /**
   * Add one or more embedded wrap packages
   * This is equivalent to calling addPackage for each package
   *
   * @param uriPackages: an object where keys are uris and packages are value
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackages(uriPackages: Record<string, IWrapPackage>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removePackage
  /**
   * Remove an embedded wrap package
   *
   * @param uri: the package's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removePackage(uri: string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addEnv
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is modified.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the env variables for the uri
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addEnvs
  /**
   * Add one or more Envs
   * This is equivalent to calling addEnv for each Env
   *
   * @param uriEnvs: and object where key is the uri and value is the another object with the env variables for the uri
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnvs(
    uriEnvs: Record<string, Record<string, unknown>>
  ): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removeEnv
  /**
   * Remove an Env
   *
   * @param uri: the URI associated with the Env
   * @returns IClientConfigBuilder (mutated self)
   */
  removeEnv(uri: string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-setEnv
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is replaced.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the environment variables for the uri
   * @returns IClientConfigBuilder (mutated self)
   */
  setEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder;
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
    interfaceUri: string,
    implementationUri: string
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
    interfaceUri: string,
    implementationUris: Array<string>
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
    interfaceUri: string,
    implementationUri: string
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
  addRedirect(from: string, to: string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addRedirects
  /**
   * Add an array of URI redirects
   *
   * @param redirects: an object where key is from and value is to
   * @returns IClientConfigBuilder (mutated self)
   */
  addRedirects(redirects: Record<string, string>): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-removeRedirect
  /**
   * Remove a URI redirect
   *
   * @param from: the URI that is being redirected
   * @returns IClientConfigBuilder (mutated self)
   */
  removeRedirect(from: string): IClientConfigBuilder;
  // $end

  // $start: IClientConfigBuilder-addResolver
  /**
   * Add a URI Resolver, capable of resolving a URI to a wrapper
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<string>
   *   | IUriPackage<string>
   *   | IUriWrapper<string>
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
   *   | IUriRedirect<string>
   *   | IUriPackage<string>
   *   | IUriWrapper<string>
   *   | UriResolverLike[];
   *
   * @param resolvers: A list of UriResolverLike
   * @returns IClientConfigBuilder (mutated self)
   */
  addResolvers(resolvers: UriResolverLike[]): IClientConfigBuilder;
  // $end
}
