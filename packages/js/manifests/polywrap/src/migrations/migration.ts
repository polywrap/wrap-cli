import {
  AnyAppManifest,
  AnyBuildManifest,
  AnyCodegenManifest,
  AnyDeployManifest,
  AnyInfraManifest,
  AnyMetaManifest,
  AnyPluginManifest,
  AnyPolywrapManifest,
  AnyPolywrapWorkflow,
} from "../formats";

type AnyManifest =
  | AnyPolywrapManifest
  | AnyPluginManifest
  | AnyAppManifest
  | AnyInfraManifest
  | AnyDeployManifest
  | AnyBuildManifest
  | AnyMetaManifest
  | AnyPolywrapWorkflow
  | AnyCodegenManifest;

export type Migrator = {
  from: string;
  to: string;
  migrate: (manifest: AnyManifest) => AnyManifest;
};
