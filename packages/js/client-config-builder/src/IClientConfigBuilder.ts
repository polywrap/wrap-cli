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
  build(): ClientConfig<Uri>;
  buildCoreConfig(): CoreClientConfig<Uri>;
  add(config: Partial<ClientConfig>): IClientConfigBuilder;
  addDefaults(): IClientConfigBuilder;
  addWrapper(uriWrapper: IUriWrapper<Uri | string>): IClientConfigBuilder;
  addWrappers(uriWrappers: IUriWrapper<Uri | string>[]): IClientConfigBuilder;
  removeWrapper(uri: Uri | string): IClientConfigBuilder;
  addPackage(uriPackage: IUriPackage<Uri | string>): IClientConfigBuilder;
  addPackages(uriPackages: IUriPackage<Uri | string>[]): IClientConfigBuilder;
  removePackage(uri: Uri | string): IClientConfigBuilder;
  addEnv(uri: Uri | string, env: Record<string, unknown>): IClientConfigBuilder;
  addEnvs(envs: Env<Uri | string>[]): IClientConfigBuilder;
  removeEnv(uri: Uri | string): IClientConfigBuilder;
  setEnv(uri: Uri | string, env: Record<string, unknown>): IClientConfigBuilder;
  addInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): IClientConfigBuilder;
  addInterfaceImplementations(
    interfaceUri: Uri | string,
    implementationUris: Array<Uri | string>
  ): IClientConfigBuilder;
  removeInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): IClientConfigBuilder;
  addRedirect(from: Uri | string, to: Uri | string): IClientConfigBuilder;
  addRedirects(redirects: IUriRedirect<Uri | string>[]): IClientConfigBuilder;
  removeRedirect(from: Uri | string): IClientConfigBuilder;
  addResolver(resolver: UriResolverLike): IClientConfigBuilder;
  addResolvers(resolvers: UriResolverLike[]): IClientConfigBuilder;
}
