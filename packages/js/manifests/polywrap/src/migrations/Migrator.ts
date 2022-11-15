import { ILogger } from "@polywrap/logging-js";
import {
  AnyAppManifest,
  AnyBuildManifest,
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
  | AnyPolywrapWorkflow;

export type Migrator = {
  from: string;
  to: string;
  migrate: (manifest: AnyManifest, logger?: ILogger) => AnyManifest;
};
