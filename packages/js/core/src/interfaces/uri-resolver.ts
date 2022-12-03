import { Uri, Invoker } from "../";

import { Result } from "@polywrap/result";

export interface MaybeUriOrManifest {
  uri?: string;
  manifest?: Uint8Array;
}

export const module = {
  tryResolveUri: async (
    invoker: Invoker,
    wrapper: Uri,
    uri: Uri
  ): Promise<Result<MaybeUriOrManifest, Error>> => {
    return invoker.invoke<MaybeUriOrManifest>({
      uri: wrapper.uri,
      method: `tryResolveUri`,
      args: {
        authority: uri.authority,
        path: uri.path,
      },
    });
  },
  getFile: async (
    invoker: Invoker,
    wrapper: Uri,
    path: string
  ): Promise<Result<Uint8Array | undefined, Error>> => {
    return invoker.invoke<Uint8Array | undefined>({
      uri: wrapper.uri,
      method: "getFile",
      args: {
        path,
      },
    });
  },
};
