import { ClientConfig } from "./ClientConfig";
import { ClientConfigBuilder } from "./ClientConfigBuilder";

import {
  CoreClientConfig,
  Uri,
  IUriResolver,
  IUriPackage,
  IUriWrapper,
  Env,
  IUriRedirect,
} from "@polywrap/core-js";
import { IWrapperCache, UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface IClientConfigBuilder {
  add(config: Partial<ClientConfig>): ClientConfigBuilder;
  addDefaults(): ClientConfigBuilder;
  addWrapper(uriWrapper: IUriWrapper<Uri | string>): ClientConfigBuilder;
  addWrappers(uriWrappers: IUriWrapper<Uri | string>[]): ClientConfigBuilder;
  removeWrapper(uri: Uri | string): ClientConfigBuilder;
  addPackage(uriPackage: IUriPackage<Uri | string>): ClientConfigBuilder;
  addPackages(uriPackages: IUriPackage<Uri | string>[]): ClientConfigBuilder;
  removePackage(uri: Uri | string): ClientConfigBuilder;
  addEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder;
  addEnvs(envs: Env<Uri | string>[]): ClientConfigBuilder;
  removeEnv(uri: Uri | string): ClientConfigBuilder;
  setEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder;
  addInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): ClientConfigBuilder;
  addInterfaceImplementations(
    interfaceUri: Uri | string,
    implementationUris: Array<Uri | string>
  ): ClientConfigBuilder;
  removeInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): ClientConfigBuilder;
  addRedirect(from: Uri | string, to: Uri | string): ClientConfigBuilder;
  addRedirects(redirects: IUriRedirect<Uri | string>[]): ClientConfigBuilder;
  removeRedirect(from: Uri | string): ClientConfigBuilder;
  addResolver(resolver: UriResolverLike): ClientConfigBuilder;
  addResolvers(resolvers: UriResolverLike[]): ClientConfigBuilder;
  build(): ClientConfig<Uri>;
  buildCoreConfig(
    wrapperCache?: IWrapperCache,
    resolver?: IUriResolver<unknown>
  ): CoreClientConfig<Uri>;
}
