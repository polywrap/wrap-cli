// TODO: https://github.com/web3-api/monorepo/issues/101
import { Uri, Client, InvokeApiResult } from "../";

interface MaybeUriOrManifest {
  uri?: string;
  manifest?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Query = {
  tryResolveUri: (
    client: Client,
    api: Uri,
    uri: Uri
  ): Promise<InvokeApiResult<MaybeUriOrManifest>> =>
    client.invoke<MaybeUriOrManifest>({
      uri: api.uri,
      module: "query",
      method: `tryResolveUri`,
      input: {
        authority: uri.authority,
        path: uri.path,
      },
    }),
  getFile: (
    client: Client,
    api: Uri,
    path: string
  ): Promise<InvokeApiResult<ArrayBuffer>> =>
    client.invoke<ArrayBuffer>({
      uri: api.uri,
      module: "query",
      method: "getFile",
      input: {
        path,
      },
    }),
};
