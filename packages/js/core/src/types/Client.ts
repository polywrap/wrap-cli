import {
  QueryHandler,
  InvokeHandler,
  Uri,
  PluginPackageManifest
} from "./";
import {
  BuildManifest,
  Web3ApiManifest,
  MetaManifest,
} from "../manifest";

export type ManifestFile = "plugin" | "web3api" | "meta" | "build";

export type Manifest<T> =
  T extends "plugin" ? PluginPackageManifest :
  T extends "web3api" ? Web3ApiManifest :
  T extends "build" ? BuildManifest :
  T extends "meta" ? MetaManifest :
  never;

export interface GetManifestOptions<T extends ManifestFile> {
  uri: Uri | string;
  type: T;
}

export interface GetFileOptions {
  uri: Uri | string;
  path: string;
  encoding?: string;
}

export interface Client extends QueryHandler, InvokeHandler {

}

// TODO: typings + client methods + plugin(package)manifest
