import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Client, Wrapper, Uri, GetManifestOptions } from ".";

export interface IWrapPackage {
  uri: Uri;
  getManifest(options?: GetManifestOptions): Promise<WrapManifest>;
  createWrapper(client: Client, uriHistory: Uri[]): Promise<Wrapper>;
}
