// TODO: https://github.com/polywrap/monorepo/issues/101
import { Uri, Invoker, InvokeResult } from "../";

import { Tracer } from "@polywrap/tracing-js";

export interface MaybeUriOrManifest {
  uri?: string;
  manifest?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Query = {
  tryResolveUri: Tracer.traceFunc(
    "core: uri-resolver: tryResolveUri",
    async (
      invoker: Invoker,
      wrapper: Uri,
      uri: Uri
    ): Promise<InvokeResult<MaybeUriOrManifest>> => {
      return invoker.invoke<MaybeUriOrManifest>({
        uri: wrapper.uri,
        method: `tryResolveUri`,
        args: {
          authority: uri.authority,
          path: uri.path,
        },
      });
    }
  ),
  getFile: Tracer.traceFunc(
    "core: uri-resolver: getFile",
    async (
      invoker: Invoker,
      wrapper: Uri,
      path: string
    ): Promise<InvokeResult<Uint8Array>> => {
      return invoker.invoke<Uint8Array>({
        uri: wrapper.uri,
        method: "getFile",
        args: {
          path,
        },
      });
    }
  ),
};
