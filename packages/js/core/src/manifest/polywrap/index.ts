export * from "./polywrap";
export * from "./polywrap.build";
export * from "./polywrap.infra";
export * from "./polywrap.deploy";
export * from "./polywrap.meta";
export * from "./polywrap.plugin";
export * from "./polywrap.app";

import { PolywrapManifest } from "./polywrap";
import { BuildManifest } from "./polywrap.build";
import { InfraManifest } from "./polywrap.infra";
import { DeployManifest } from "./polywrap.deploy";
import { MetaManifest } from "./polywrap.meta";

export type ManifestArtifactType =
  | "polywrap"
  | "meta"
  | "build"
  | "deploy"
  | "infra";

export type AnyManifestArtifact<
  TManifestType extends ManifestArtifactType
> = TManifestType extends "polywrap"
  ? PolywrapManifest
  : TManifestType extends "build"
  ? BuildManifest
  : TManifestType extends "infra"
  ? InfraManifest
  : TManifestType extends "deploy"
  ? DeployManifest
  : TManifestType extends "meta"
  ? MetaManifest
  : never;
