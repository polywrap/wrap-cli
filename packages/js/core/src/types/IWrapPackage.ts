import { Wrapper, GetManifestOptions } from ".";

import {
  DeserializeManifestOptions,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

export interface IWrapPackage {
  getManifest(
    options?: GetManifestOptions
  ): Promise<Result<Readonly<WrapManifest>, Error>>;
  createWrapper(
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, Error>>;
}
