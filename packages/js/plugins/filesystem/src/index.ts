import {
  Client,
  Module,
  Input_tryResolveUri,
  Input_getFile,
  UriResolver_MaybeUriOrManifest,
  Bytes,
  manifest,
} from "./w3-man";

import path from "path";
import fs from "fs";
import { PluginFactory } from "@web3api/core-js";

export type FilesystemPluginConfig = Record<string, unknown>;

export class FilesystemPlugin extends Module<FilesystemPluginConfig> {
  async tryResolveUri(
    input: Input_tryResolveUri,
    _client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (input.authority !== "fs") {
      return null;
    }

    const manifestSearchPatterns = [
      "web3api.json",
      "web3api.yaml",
      "web3api.yml",
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
export const filesystemPlugin: PluginFactory<FilesystemPluginConfig> = (
  opts: FilesystemPluginConfig
) => {
  return {
    factory: () => new FilesystemPlugin(opts),
    manifest,
  };
};

export const plugin = filesystemPlugin;
