import { Uri, Wrapper, PolywrapManifest, Env } from "../../../..";

export type CreateWrapperFunc = (
  uri: Uri,
  manifest: PolywrapManifest,
  uriResolver: string, // name or URI
  environment: Env<Uri> | undefined
) => Wrapper;
