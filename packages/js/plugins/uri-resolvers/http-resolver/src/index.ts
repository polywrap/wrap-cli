import {
  Args_getFile,
  Args_tryResolveUri,
  Bytes,
  Client,
  Http_Module,
  manifest,
  Module,
  UriResolver_MaybeUriOrManifest,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

type NoConfig = Record<string, never>;

export class HttpResolverPlugin extends Module<NoConfig> {
  // uri-resolver.core.polywrap.eth
  public async tryResolveUri(
    args: Args_tryResolveUri,
    _client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (args.authority !== "http") {
      return null;
    }

    const manifestSearchPattern = "wrap.info";

    let manifest: Bytes | undefined;

    try {
      const manifestResult = await Http_Module.get(
        {
          url: `${args.path}/${manifestSearchPattern}`,
          request: {
            responseType: "BINARY",
          },
        },
        _client
      );

      const result = manifestResult.data;

      if (result && result.body) {
        manifest = Buffer.from(result.body, "base64");
      }
    } catch (e) {
      // TODO: logging
      // https://github.com/polywrap/monorepo/issues/33
    }

    return { uri: null, manifest: manifest ?? null };
  }

  public async getFile(
    args: Args_getFile,
    client: Client
  ): Promise<Bytes | null> {
    try {
      const resolveResult = await Http_Module.get(
        {
          url: args.path,
          request: {
            responseType: "BINARY",
          },
        },
        client
      );

      const result = resolveResult.data;

      if (!result || !result.body) {
        return null;
      }

      return Buffer.from(result.body, "base64");
    } catch (e) {
      return null;
    }
  }
}

export const httpResolverPlugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new HttpResolverPlugin({}),
    manifest,
  };
};

export const plugin = httpResolverPlugin;
