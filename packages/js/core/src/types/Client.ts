import {
  QueryHandler,
  InvokeHandler,
  SubscriptionHandler,
  UriRedirect,
  Uri,
  PluginRegistration,
  InterfaceImplementations,
} from "./";
import { ManifestType, AnyManifest } from "../manifest";

export interface ClientConfig<TUri extends Uri | string = string> {
  redirects: UriRedirect<TUri>[];
  plugins: PluginRegistration<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
}

export interface Contextualized {
  contextId?: string;
}

export interface GetRedirectsOptions extends Contextualized { }

export interface GetPluginsOptions extends Contextualized { }

export interface GetInterfacesOptions extends Contextualized { }

export interface GetSchemaOptions extends Contextualized { }

export interface GetManifestOptions<TManifestType extends ManifestType> extends Contextualized {
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

  getInterfaces(options: GetInterfacesOptions): readonly InterfaceImplementations<Uri>[];

  getSchema<TUri extends Uri | string>(uri: TUri, options: GetSchemaOptions): Promise<string>;

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
}
