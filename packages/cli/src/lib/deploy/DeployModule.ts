import { Uri } from "@polywrap/core-js";

export interface DeployModule {
  execute(uri: Uri, config?: unknown): Promise<Uri>;
}
