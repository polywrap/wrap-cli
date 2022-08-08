import { Deployer } from "../deploy";

import { Schema as JsonSchema } from "jsonschema";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";

export interface Deployable {
  getDeployManifestPath(): Promise<string | undefined>;

  getDeployManifestDir(): Promise<string | undefined>;

  getDeployManifest(): Promise<DeployManifest | undefined>;

  getDeployModule(
    moduleName: string
  ): Promise<{ deployer: Deployer; manifestExt: JsonSchema | undefined }>;

  cacheDeployModules(modules: string[]): Promise<void>;
}
