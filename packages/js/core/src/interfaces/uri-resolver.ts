// TODO: https://github.com/web3-api/monorepo/issues/101
import { Uri, InvokeHandler, InvokeApiResult } from "../";

import { Tracer } from "@web3api/tracing-js";

export interface MaybeUriOrManifest {
  uri?: string;
  manifest?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Query = {
  tryResolveUri: Tracer.traceFunc(
    "core: uri-resolver: tryResolveUri",
    async (
      invoke: InvokeHandler["invoke"],
      api: Uri,
      uri: Uri
    ): Promise<InvokeApiResult<MaybeUriOrManifest>> => {
      return invoke<MaybeUriOrManifest>({
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
    "core: uri-resolver: getFile",
    async (
      invoke: InvokeHandler["invoke"],
      api: Uri,
      path: string
    ): Promise<InvokeApiResult<ArrayBuffer>> => {
      return invoke<ArrayBuffer>({
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
