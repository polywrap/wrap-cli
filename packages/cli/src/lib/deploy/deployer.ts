import { Uri } from "@polywrap/core-js";

export interface Deployer {
  execute(uri: Uri, config?: unknown): Promise<Uri>;
}
