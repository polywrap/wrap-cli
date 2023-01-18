import { DeployModule } from "./DeployModule";

import { Schema as JsonSchema } from "jsonschema";

export interface DeployPackage {
  deployModule: DeployModule;
  manifestExt: JsonSchema | undefined;
}
