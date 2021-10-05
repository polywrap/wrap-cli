import {
  QueryHandler,
  InvokeHandler,
  SubscriptionHandler,
  UriRedirect,
  Uri,
  InvokeApiOptions,
  QueryApiOptions,
  PluginRegistration,
  InterfaceImplementations,
} from "./";
import { ManifestType, AnyManifest } from "../manifest";
import { SubscribeOptions } from "./Subscription";

export interface GetManifestOptions<TManifestType extends ManifestType> {
  type: TManifestType;
}

export interface GetFileOptions {
  path: string;
  encoding?: "utf-8" | string;
}

export interface InvokeContext {
  readonly config: ClientConfig<Uri>;
}

export interface ClientConfig<TUri = string> {
  redirects?: UriRedirect<TUri>[];
  plugins?: PluginRegistration<TUri>[];
  interfaces?: InterfaceImplementations<TUri>[];
}

export interface GetImplementationsOptions {
  applyRedirects?: boolean;
}

export interface Client
  extends QueryHandler,
    SubscriptionHandler,
    InvokeHandler {
  getInvokeContext: (id: string) => InvokeContext;
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

export const wrapClient = (client: Client, id: string): Client => ({
  query: (options: QueryApiOptions<Record<string, unknown>, string | Uri>) =>
    client.query({ ...options, id }),
  invoke: (options: InvokeApiOptions<string | Uri>) =>
    client.invoke({ ...options, id }),
  subscribe: (
    options: SubscribeOptions<Record<string, unknown>, string | Uri>
  ) => client.subscribe({ ...options, id }),
  getInvokeContext: () => client.getInvokeContext(id),
  getFile: (uri: string | Uri, options: GetFileOptions) =>
    client.getFile(uri, options),
  getSchema: (uri: string | Uri) => client.getSchema(uri),
  getManifest: <TUri extends string | Uri, TManifestType extends ManifestType>(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ) => client.getManifest(uri, options),
  getImplementations: <TUri extends Uri | string>(
    uri: TUri,
    options?: GetImplementationsOptions
  ) => client.getImplementations(uri, options),
});
