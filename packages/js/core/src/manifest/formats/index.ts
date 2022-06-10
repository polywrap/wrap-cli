export * from "./web3api";
export * from "./web3api.build";
export * from "./web3api.infra";
export * from "./web3api.deploy";
export * from "./web3api.meta";
export * from "./web3api.plugin";
export * from "./web3api.app";

import { Web3ApiManifest } from "./web3api";
import { BuildManifest } from "./web3api.build";
import { InfraManifest } from "./web3api.infra";
import { DeployManifest } from "./web3api.deploy";
import { MetaManifest } from "./web3api.meta";

export type ManifestArtifactType =
  | "web3api"
  | "meta"
  | "build"
  | "deploy"
  | "infra";

export type AnyManifestArtifact<
  TManifestType extends ManifestArtifactType
> = TManifestType extends "web3api"
  ? Web3ApiManifest
  : TManifestType extends "build"
  ? BuildManifest
  : TManifestType extends "infra"
  ? InfraManifest
  : TManifestType extends "deploy"
  ? DeployManifest
  : TManifestType extends "meta"
  ? MetaManifest
  : never;
