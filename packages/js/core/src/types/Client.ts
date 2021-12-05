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

export interface GetManifestOptions<TManifestType extends ManifestType> {
  type: TManifestType;
}

export interface GetFileOptions {
  path: string;
  encoding?: "utf-8" | string;
}

export interface ClientConfig<TUri extends Uri | string = string> {
  redirects: UriRedirect<TUri>[];
  plugins: PluginRegistration<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
}

export interface GetImplementationsOptions {
  applyRedirects?: boolean;
}

export interface Client
  extends QueryHandler,
    SubscriptionHandler,
    InvokeHandler {
  getInvokeContext: (id: string) => ClientConfig<Uri>;
  getSchema<TUri extends Uri | string>(uri: TUri): Promise<string>;

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
    options?: GetImplementationsOptions
  ): TUri[];
}
