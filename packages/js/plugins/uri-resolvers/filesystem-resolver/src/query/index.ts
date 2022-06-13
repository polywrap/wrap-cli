import {
  Bytes,
  Client,
  Filesystem_EncodingEnum,
  Filesystem_Query,
  Input_getFile,
  Input_tryResolveUri,
  Module,
  UriResolver_MaybeUriOrManifest,
} from "./w3";

export type QueryConfig = Record<string, unknown>;

import path from "path";

export class Query extends Module<QueryConfig> {
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
      const manifestExistsResult = await Filesystem_Query.exists(
        { path: manifestPath },
        _client
      );

      if (manifestExistsResult.data) {
        try {
          const manifestResult = await Filesystem_Query.readFileAsString(
            { path: manifestPath, encoding: Filesystem_EncodingEnum.UTF8 },
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
      // Noting found
      return { uri: null, manifest: null };
    }
  }

  async getFile(input: Input_getFile, _client: Client): Promise<Bytes | null> {
    try {
      const fileResult = await Filesystem_Query.readFile(
        { path: input.path },
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
