import { Uri, Wrapper, WrapManifest, Env } from "../../../..";

export type CreateWrapperFunc = (
  uri: Uri,
  manifest: WrapManifest,
  uriResolver: string, // name or URI
  environment: Env<Uri> | undefined
) => Wrapper;
