import {
  QueryHandler,
  Invoker,
  SubscriptionHandler,
  UriRedirect,
  Uri,
  PluginRegistration,
  InterfaceImplementations,
  Env,
  WorkflowHandler,
} from "./";
import { AnyManifestArtifact, ManifestArtifactType } from "../manifest";
import { UriResolver } from "../uri-resolution/core";
import { UriResolverHandler } from "./UriResolver";

export interface ClientConfig<TUri extends Uri | string = string> {
  redirects: UriRedirect<TUri>[];
  plugins: PluginRegistration<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
  envs: Env<TUri>[];
  uriResolvers: UriResolver[];
}

export interface Contextualized {
  contextId?: string;
}

export type GetRedirectsOptions = Contextualized;

export type GetPluginsOptions = Contextualized;

export type GetInterfacesOptions = Contextualized;

export type GetSchemaOptions = Contextualized;

export type GetEnvsOptions = Contextualized;

export type GetUriResolversOptions = Contextualized;

export interface GetManifestOptions<
  TManifestArtifactType extends ManifestArtifactType
> extends Contextualized {
  type: TManifestArtifactType;
}

export interface GetFileOptions extends Contextualized {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions extends Contextualized {
  applyRedirects?: boolean;
}

export interface Client
  extends Invoker,
    QueryHandler,
    SubscriptionHandler,
    WorkflowHandler,
    UriResolverHandler {
  getRedirects(options: GetRedirectsOptions): readonly UriRedirect<Uri>[];

  getPlugins(options: GetPluginsOptions): readonly PluginRegistration<Uri>[];

  getInterfaces(
    options: GetInterfacesOptions
  ): readonly InterfaceImplementations<Uri>[];

  getEnvs(options: GetEnvsOptions): readonly Env<Uri>[];

  getEnvByUri<TUri extends Uri | string>(
    uri: TUri,
    options: GetEnvsOptions
  ): Env<Uri> | undefined;

  getUriResolvers(options: GetUriResolversOptions): readonly UriResolver[];

  getSchema<TUri extends Uri | string>(
    uri: TUri,
    options: GetSchemaOptions
  ): Promise<string>;

  getManifest<
    TUri extends Uri | string,
    TManifestArtifactType extends ManifestArtifactType
  >(
    uri: TUri,
    options: GetManifestOptions<TManifestArtifactType>
  ): Promise<AnyManifestArtifact<TManifestArtifactType>>;

  getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | Uint8Array>;

  getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions
  ): TUri[];
}
