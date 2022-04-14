import { Deployer } from "./deployer";

import { Schema as JsonSchema } from "jsonschema";

export * from "./deployer";

export interface DeployPackage {
  deployer: Deployer;
  manifestExt: JsonSchema | undefined;
}
