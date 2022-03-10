export * from "./web3api";
export * from "./web3api.build";
export * from "./web3api.meta";
export * from "./web3api.plugin";
export * from "./web3api.app";

import { Web3ApiManifest } from "./web3api";
import { BuildManifest } from "./web3api.build";
import { MetaManifest } from "./web3api.meta";

export type ManifestArtifactType = "web3api" | "meta" | "build";

export type AnyManifestArtifact<
  TManifestType extends ManifestArtifactType
> = TManifestType extends "web3api"
  ? Web3ApiManifest
  : TManifestType extends "build"
  ? BuildManifest
  : TManifestType extends "meta"
  ? MetaManifest
  : never;
