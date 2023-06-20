import { ILogger } from "@polywrap/logging-js";
import {
  AnyAppManifest,
  AnyBuildManifest,
  AnyDeployManifest,
  AnyInfraManifest,
  AnyPluginManifest,
  AnyPolywrapManifest,
  AnyPolywrapWorkflow,
  AnyDocsManifest
} from "../formats";

type AnyManifest =
  | AnyPolywrapManifest
  | AnyPluginManifest
  | AnyAppManifest
  | AnyInfraManifest
  | AnyDeployManifest
  | AnyBuildManifest
  | AnyPolywrapWorkflow
  | AnyDocsManifest;

export type Migrator = {
  from: string;
  to: string;
  migrate: (manifest: AnyManifest, logger?: ILogger) => AnyManifest;
};
