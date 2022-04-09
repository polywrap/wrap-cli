import { Uri, Api, Web3ApiManifest, Env } from "../../../..";

export type CreateApiFunc = (
  uri: Uri,
  manifest: Web3ApiManifest,
  uriResolver: string, // name or URI
  environment: Env<Uri> | undefined
) => Api;
