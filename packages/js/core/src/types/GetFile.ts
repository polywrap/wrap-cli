import { PluginManifest, Uri } from "./index";
import { BuildManifest, Web3ApiManifest } from "../manifest";

export type ManifestFile = "plugin" | "web3api" | "meta" | "build";

export type Manifest<T> = T extends "plugin"
  ? PluginManifest
  : T extends "web3api"
  ? Web3ApiManifest
  : T extends "meta"
  ? Web3ApiManifest
  : T extends "build"
  ? BuildManifest
  : PluginManifest | Web3ApiManifest;

export interface GetManifestOptions<T extends ManifestFile> {
  uri: Uri | string;
  type: T;
}

export interface GetFileOptions {
  uri: Uri | string;
  path: string;
  encoding?: string;
}
