// TODO: https://github.com/web3-api/monorepo/issues/101
import { Uri, Client, InvokeApiResult } from "../";

import { Tracer } from "@web3api/tracing";

interface MaybeUriOrManifest {
  uri?: string;
  manifest?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Query = {
  tryResolveUri: Tracer.traceFunc(
    "core: api-resolver: tryResolveUri",
    async (
      client: Client,
      api: Uri,
      uri: Uri
    ): Promise<InvokeApiResult<MaybeUriOrManifest>> => {
      return client.invoke<MaybeUriOrManifest>({
        uri: api.uri,
        module: "query",
        method: `tryResolveUri`,
        input: {
          authority: uri.authority,
          path: uri.path,
        },
      });
    }
  ),
  getFile: Tracer.traceFunc(
    "core: api-resolver: getFile",
    async (
      client: Client,
      api: Uri,
      path: string
    ): Promise<InvokeApiResult<ArrayBuffer>> => {
      return client.invoke<ArrayBuffer>({
        uri: api.uri,
        module: "query",
        method: "getFile",
        input: {
          path,
        },
      });
    }
  ),
};
