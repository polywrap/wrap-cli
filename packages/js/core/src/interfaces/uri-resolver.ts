import { Uri, Invoker } from "../";

import { Tracer } from "@polywrap/tracing-js";
import { Result } from "@polywrap/result";

// $start: MaybeUriOrManifest
/** Contains either a Uri, a manifest, or neither */
export interface MaybeUriOrManifest {
  /** wrap URI */
  uri?: string;

  /** Serialized wrap manifest */
  manifest?: Uint8Array;
}
// $end

/** */
export const module = {
  // $start: UriResolverInterface-tryResolveUri
  /**
   * Use an invoker to try to resolve a URI using a wrapper that implements the UriResolver interface
   *
   * @param invoker - invokes the wrapper with the resolution URI as an argument
   * @param wrapper - URI for wrapper that implements the UriResolver interface
   * @param uri - the URI to resolve
   */
  tryResolveUri: Tracer.traceFunc(
    "core: uri-resolver: tryResolveUri",
    async (
      invoker: Invoker,
      wrapper: Uri,
      uri: Uri
    ): Promise<Result<MaybeUriOrManifest, Error>> => {
      // $end
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
  // $start: UriResolverInterface-getFile
  /**
   * Use an invoker to fetch a file using a wrapper that implements the UriResolver interface
   *
   * @param invoker - invokes the wrapper with the filepath as an argument
   * @param wrapper - URI for wrapper that implements the UriResolver interface
   * @param path - a filepath, the format of which depends on the UriResolver
   */
  getFile: Tracer.traceFunc(
    "core: uri-resolver: getFile",
    async (
      invoker: Invoker,
      wrapper: Uri,
      path: string
    ): Promise<Result<Uint8Array | undefined, Error>> => {
      // $end
      return invoker.invoke<Uint8Array | undefined>({
        uri: wrapper.uri,
        method: "getFile",
        args: {
          path,
        },
      });
    }
  ),
};
