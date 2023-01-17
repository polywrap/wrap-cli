import { DeployModule } from "./Deployer";

import { Schema as JsonSchema } from "jsonschema";

export * from "./Deployer";
export * from "./step";
export * from "./job";

export interface DeployPackage {
  deployModule: DeployModule;
  manifestExt: JsonSchema | undefined;
}
