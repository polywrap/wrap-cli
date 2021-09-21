import {
  QueryHandler,
  InvokeHandler,
  SubscriptionHandler,
  UriRedirect,
  Uri,
  InvokeApiOptions,
  QueryApiOptions,
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
  readonly redirects: UriRedirect<Uri>[];
}

export interface GetImplementationsOptions {
  applyRedirects?: boolean;
}

export interface Client
  extends QueryHandler,
    SubscriptionHandler,
    InvokeHandler {
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

  getInvokeContext: (id: string) => InvokeContext;
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
