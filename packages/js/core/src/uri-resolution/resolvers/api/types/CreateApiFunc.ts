import { Uri, Api, Web3ApiManifest, Env } from "../../../..";

export type CreateApiFunc = (
  uri: Uri,
  manifest: Web3ApiManifest,
  uriResolver: Uri,
  environment: Env<Uri> | undefined
) => Api;
