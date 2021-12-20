import {
  QueryHandler,
  InvokeHandler,
  SubscriptionHandler,
  UriRedirect,
  Uri,
  PluginRegistration,
  InterfaceImplementations,
  Environment,
} from "./";
import { ManifestType, AnyManifest } from "../manifest";

export interface ClientConfig<TUri extends Uri | string = string> {
  redirects: UriRedirect<TUri>[];
  plugins: PluginRegistration<TUri>[];
  environments: Environment<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
}

export interface Contextualized {
  contextId?: string;
}

export type GetRedirectsOptions = Contextualized;

export type GetPluginsOptions = Contextualized;

export type GetInterfacesOptions = Contextualized;

export type GetSchemaOptions = Contextualized;

export type GetEnvironmentsOptions = Contextualized;

export interface GetManifestOptions<TManifestType extends ManifestType>
  extends Contextualized {
  type: TManifestType;
}

export interface GetFileOptions extends Contextualized {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions extends Contextualized {
  applyRedirects?: boolean;
}

export interface Client
  extends QueryHandler,
    SubscriptionHandler,
    InvokeHandler {
  getRedirects(options: GetRedirectsOptions): readonly UriRedirect<Uri>[];

  getPlugins(options: GetPluginsOptions): readonly PluginRegistration<Uri>[];

  getInterfaces(
    options: GetInterfacesOptions
  ): readonly InterfaceImplementations<Uri>[];

  getEnvironments(options: GetEnvironmentsOptions): readonly Environment<Uri>[];

  getSchema<TUri extends Uri | string>(
    uri: TUri,
    options: GetSchemaOptions
  ): Promise<string>;

  getManifest<TUri extends Uri | string, TManifestType extends ManifestType>(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ): Promise<AnyManifest<TManifestType>>;

  getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | ArrayBuffer>;

  getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions
  ): TUri[];

  getEnvironmentByUri<TUri extends Uri | string>(
    uri: TUri,
    options: GetEnvironmentsOptions
  ): Environment<TUri> | undefined;
}
