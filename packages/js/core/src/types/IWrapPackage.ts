import { Wrapper, GetManifestOptions } from ".";

import {
  DeserializeManifestOptions,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";

export interface IWrapPackage {
  getManifest(options?: GetManifestOptions): Promise<WrapManifest>;
  createWrapper(options?: DeserializeManifestOptions): Promise<Wrapper>;
}
