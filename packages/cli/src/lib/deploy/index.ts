import { Deployer } from "./deployer";

import { Schema as JsonSchema } from "jsonschema";

export * from "./deployer";
export * from "./step";
export * from "./job";

export interface DeployPackage {
  deployer: Deployer;
  manifestExt: JsonSchema | undefined;
}
