import {
  QueryHandler,
  Invoker,
  SubscriptionHandler,
  UriRedirect,
  Uri,
  PluginRegistration,
  InterfaceImplementations,
  Env,
} from "./";
import { UriResolver } from "../uri-resolution/core";
import { UriResolverHandler } from "./UriResolver";
import { WrapperCache } from "./WrapperCache";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export interface ClientConfig<TUri extends Uri | string = string> {
  redirects: UriRedirect<TUri>[];
  plugins: PluginRegistration<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
  envs: Env<TUri>[];
  uriResolvers: UriResolver[];
  wrapperCache?: WrapperCache;
}

export interface GetManifestOptions {
  noValidate?: boolean;
}

export interface GetFileOptions {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions {
  applyRedirects?: boolean;
}

export interface Client
  extends Invoker,
    QueryHandler,
    SubscriptionHandler,
    UriResolverHandler {

  reconfigure(config: Partial<ClientConfig<string | Uri>>): Client;

  getRedirects(): readonly UriRedirect<Uri>[];

  getPlugins(): readonly PluginRegistration<Uri>[];

  getInterfaces(): readonly InterfaceImplementations<Uri>[];

  getEnvs(): readonly Env<Uri>[];

  getEnvByUri<TUri extends Uri | string>(
    uri: TUri,
  ): Env<Uri> | undefined;

  getUriResolvers(): readonly UriResolver[];

  getManifest<TUri extends Uri | string>(
    uri: TUri,
    options: GetManifestOptions
  ): Promise<WrapManifest>;

  getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | Uint8Array>;

  getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions
  ): TUri[];
}
