import { PluginManifest, Uri } from "../types";
import { BuildManifest, Web3ApiManifest } from "./formats";

export type ManifestFile =
  | "manifest.ts"
  | "web3api.yaml"
  | "web3api.meta.yaml"
  | "web3api.build.yaml";

export type Manifest<T> = T extends "manifest.ts"
  ? PluginManifest
  : T extends "web3api.yaml"
  ? Web3ApiManifest
  : T extends "web3api.meta.yaml"
  ? Web3ApiManifest
  : T extends "web3api.build.yaml"
  ? BuildManifest
  : PluginManifest | Web3ApiManifest;

export interface GetManifestOptions<T extends ManifestFile> {
  uri: Uri | string;
  manifest?: T;
}
