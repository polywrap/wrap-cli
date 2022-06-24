import {
  Client,
  Module,
  Input_tryResolveUri,
  Input_getFile,
  UriResolver_MaybeUriOrManifest,
  Bytes,
  manifest,
} from "./wrap";

import path from "path";
import fs from "fs";
import { PluginFactory } from "@polywrap/core-js";

type NoConfig = Record<string, unknown>;

export class FilesystemPlugin extends Module<NoConfig> {
  async tryResolveUri(
    input: Input_tryResolveUri,
    _client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (input.authority !== "fs") {
      return null;
    }

    const manifestSearchPatterns = [
      "polywrap.json",
      "polywrap.yaml",
      "polywrap.yml",
    ];

    let manifest: string | undefined;

    for (const manifestSearchPattern of manifestSearchPatterns) {
      const manifestPath = path.resolve(input.path, manifestSearchPattern);

      if (fs.existsSync(manifestPath)) {
        try {
          manifest = fs.readFileSync(manifestPath, "utf-8");
        } catch (e) {
          // TODO: logging
        }
      }
    }

    if (manifest) {
      return { uri: null, manifest };
    } else {
      // Noting found
      return { uri: null, manifest: null };
    }
  }

  async getFile(input: Input_getFile, _client: Client): Promise<Bytes | null> {
    try {
      return await fs.promises.readFile(input.path);
    } catch (e) {
      return null;
    }
  }
}

export const filesystemPlugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new FilesystemPlugin({}),
    manifest,
  };
};

export const plugin = filesystemPlugin;
