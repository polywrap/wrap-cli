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

import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";
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

    if (manifestExistsResult.ok && manifestExistsResult.value) {
      try {
        const manifestResult = await FileSystem_Module.readFile(
          { path: manifestPath },
          _client
        );
        if (!manifestResult.ok) {
          console.warn(manifestResult.error);
          return { uri: null, manifest: undefined };
        }
        manifest = manifestResult.value;
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
      if (!fileResult.ok) {
        return null;
      }

      return fileResult.value;
    } catch (e) {
      return null;
    }
  }
}

export const fileSystemResolverPlugin: PluginFactory<NoConfig> = () =>
  new PluginPackage(new FileSystemResolverPlugin({}), manifest);
