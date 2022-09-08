import {
  Bytes,
  Client,
  FileSystem_Module,
  Args_getFile,
  Args_tryResolveUri,
  Module,
  UriResolver_MaybeUriOrManifest,
  manifest,
} from "./wrap";

import { PluginFactory } from "@polywrap/core-js";
import path from "path";

type NoConfig = Record<string, never>;

export class FileSystemResolverPlugin extends Module<NoConfig> {
  async tryResolveUri(
    args: Args_tryResolveUri,
    _client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (args.authority !== "fs" && args.authority !== "file") {
      return null;
    }

    const manifestSearchPattern = "wrap.info";

    let manifest: Bytes | undefined;

    const manifestPath = path.resolve(args.path, manifestSearchPattern);
    const manifestExistsResult = await FileSystem_Module.exists(
      { path: manifestPath },
      _client
    );

    if (manifestExistsResult.data) {
      try {
        const manifestResult = await FileSystem_Module.readFile(
          { path: manifestPath },
          _client
        );
        if (manifestResult.error) {
          console.warn(manifestResult.error);
        }
        manifest = manifestResult.data;
      } catch (e) {
        // TODO: logging
      }
    }

    return { uri: null, manifest };
  }

  async getFile(args: Args_getFile, _client: Client): Promise<Bytes | null> {
    try {
      const fileResult = await FileSystem_Module.readFile(
        { path: args.path },
        _client
      );

      return fileResult.data ?? null;
    } catch (e) {
      return null;
    }
  }
}

export const fileSystemResolverPlugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new FileSystemResolverPlugin({}),
    manifest,
  };
};
