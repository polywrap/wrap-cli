import { Uri, Env, Wrapper } from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export type CreateWrapperFunc = (
  uri: Uri,
  manifest: WrapManifest,
  uriResolver: string, // name or URI
  environment: Env<Uri> | undefined
) => Wrapper;
