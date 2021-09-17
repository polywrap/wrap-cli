import { QueryHandler, InvokeHandler, SubscriptionHandler, Uri } from "./";
import { ManifestType, AnyManifest } from "../manifest";

export interface GetManifestOptions<TManifestType extends ManifestType> {
  type: TManifestType;
}

export interface GetFileOptions {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions {
  applyRedirects?: boolean;
}

export interface Client extends QueryHandler, SubscriptionHandler, InvokeHandler {
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
