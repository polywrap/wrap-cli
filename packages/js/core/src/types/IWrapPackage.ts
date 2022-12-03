import { Wrapper, GetManifestOptions } from ".";

import { Result } from "@polywrap/result";

export interface IWrapPackage {
  getManifest(options?: GetManifestOptions): Promise<Result<unknown, Error>>;
  createWrapper(options?: unknown): Promise<Result<Wrapper, Error>>;
}
