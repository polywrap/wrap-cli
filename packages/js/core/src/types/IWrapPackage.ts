import { Client, Wrapper, Uri, GetManifestOptions } from ".";

import {
  DeserializeManifestOptions,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";

export interface IWrapPackage {
  uri: Uri;
  getManifest(options?: GetManifestOptions): Promise<WrapManifest>;
  createWrapper(
    client: Client,
    resolutionPath: Uri[],
    options?: DeserializeManifestOptions
  ): Promise<Wrapper>;
}
