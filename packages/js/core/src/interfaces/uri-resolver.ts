import { Uri, Invoker, WrapError } from "../";

import { Tracer } from "@polywrap/tracing-js";
import { Result } from "@polywrap/result";

export interface MaybeUriOrManifest {
  uri?: string | null;
  manifest?: Uint8Array | null;
}

export const module = {
  tryResolveUri: Tracer.traceFunc(
    "core: uri-resolver: tryResolveUri",
    async (
      invoker: Invoker,
      wrapper: Uri,
      uri: Uri
    ): Promise<Result<MaybeUriOrManifest, WrapError>> => {
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
    ): Promise<Result<Uint8Array | null, WrapError>> => {
      return invoker.invoke<Uint8Array | null>({
        uri: wrapper.uri,
        method: "getFile",
        args: {
          path,
        },
      });
    }
  ),
};
