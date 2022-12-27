import { Wrapper } from ".";

import {
  DeserializeManifestOptions,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

/** Options for IWrapPackage's getManifest method */
export interface GetManifestOptions {
  noValidate?: boolean;
}

export interface IWrapPackage {
  getManifest(
    options?: GetManifestOptions
  ): Promise<Result<WrapManifest, Error>>;
  createWrapper(
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, Error>>;
}
