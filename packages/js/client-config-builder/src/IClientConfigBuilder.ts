import { BuilderConfig } from "./BuilderConfig";
import { ClientConfig } from "./ClientConfig";

import { CoreClientConfig, Wrapper, IWrapPackage } from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export type TUri = string;
export type TEnv = Record<string, unknown>;

export interface IClientConfigBuilder {
  config: BuilderConfig;
  build(): ClientConfig;
  buildCoreConfig(): CoreClientConfig;
  add(config: Partial<BuilderConfig>): IClientConfigBuilder;
  addDefaults(): IClientConfigBuilder;
  addWrapper(uri: TUri, wrapper: Wrapper): IClientConfigBuilder;
  addWrappers(uriWrappers: Record<TUri, Wrapper>): IClientConfigBuilder;
  removeWrapper(uri: TUri): IClientConfigBuilder;
  addPackage(uri: TUri, wrapPackage: IWrapPackage): IClientConfigBuilder;
  addPackages(uriPackages: Record<TUri, IWrapPackage>): IClientConfigBuilder;
  removePackage(uri: TUri): IClientConfigBuilder;
  addEnv(uri: TUri, env: TEnv): IClientConfigBuilder;
  addEnvs(uriEnvs: Record<string, TEnv>): IClientConfigBuilder;
  removeEnv(uri: TUri): IClientConfigBuilder;
  setEnv(uri: TUri, env: TEnv): IClientConfigBuilder;
  addInterfaceImplementation(
    interfaceUri: TUri,
    implementationUri: TUri
  ): IClientConfigBuilder;
  addInterfaceImplementations(
    interfaceUri: TUri,
    implementationUris: Array<TUri>
  ): IClientConfigBuilder;
  removeInterfaceImplementation(
    interfaceUri: TUri,
    implementationUri: TUri
  ): IClientConfigBuilder;
  addRedirect(from: TUri, to: TUri): IClientConfigBuilder;
  addRedirects(redirects: Record<TUri, TUri>): IClientConfigBuilder;
  removeRedirect(from: TUri): IClientConfigBuilder;
  addResolver(resolver: UriResolverLike): IClientConfigBuilder;
  addResolvers(resolvers: UriResolverLike[]): IClientConfigBuilder;
}
