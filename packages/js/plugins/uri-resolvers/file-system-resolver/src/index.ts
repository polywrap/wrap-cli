import {
  Bytes,
  Client,
  FileSystem_EncodingEnum,
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

    const manifestSearchPatterns = ["polywrap.json"];

    let manifest: string | undefined;

    for (const manifestSearchPattern of manifestSearchPatterns) {
      const manifestPath = path.resolve(args.path, manifestSearchPattern);
      const manifestExistsResult = await FileSystem_Module.exists(
        { path: manifestPath },
        _client
      );

      if (manifestExistsResult.data) {
        try {
          const manifestResult = await FileSystem_Module.readFileAsString(
            { path: manifestPath, encoding: FileSystem_EncodingEnum.UTF8 },
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
    }

    if (manifest) {
      return { uri: null, manifest };
    } else {
      // Nothing found
      return { uri: null, manifest: null };
    }
  }

  async getFile(args: Args_getFile, _client: Client): Promise<Bytes | null> {
    try {
      const fileResult = await FileSystem_Module.readFile(
        { path: args.path },
        _client
      );

      if (fileResult.data) {
        return new Uint8Array(fileResult.data);
      }

      return null;
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
