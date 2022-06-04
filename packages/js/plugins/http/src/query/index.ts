import {
  Client,
  Module,
  Input_get,
  Input_post,
  Response,
  Input_tryResolveUri,
  Input_getFile,
  Bytes,
  UriResolver_MaybeUriOrManifest,
} from "./w3";
import { fromAxiosResponse, toAxiosRequestConfig } from "./util";

import axios from "axios";

export type QueryConfig = Record<string, unknown>;

export class Query extends Module<QueryConfig> {
  async tryResolveUri(
    input: Input_tryResolveUri,
    _client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (input.authority !== "http") {
      return null;
    }

    const manifestSearchPatterns = [
      "web3api.json",
      "web3api.yaml",
      "web3api.yml",
    ];

    let manifest: string | undefined;

    for (const manifestSearchPattern of manifestSearchPatterns) {
      try {
        const response = await this.get(
          {
            url: `${input.path}/${manifestSearchPattern}`,
          },
          _client
        );

        if (response?.status === 200 && response.body) {
          manifest = response.body;
        }
      } catch (e) {
        // TODO: logging
        // https://github.com/web3-api/monorepo/issues/33
      }
    }

    if (manifest) {
      return { uri: null, manifest };
    } else {
      // Noting found
      return { uri: null, manifest: null };
    }
  }

  public async getFile(
    input: Input_getFile,
    _client: Client
  ): Promise<Bytes | null> {
    try {
      const response = await this.get(
        {
          url: input.path,
        },
        _client
      );

      if (response?.status !== 200 || !response.body) {
        return null;
      }

      return Buffer.from(response.body, "utf-8");
    } catch (e) {
      return null;
    }
  }

  public async get(
    input: Input_get,
    _client: Client
  ): Promise<Response | null> {
    const response = await axios.get<string>(
      input.url,
      input.request ? toAxiosRequestConfig(input.request) : undefined
    );
    return fromAxiosResponse(response);
  }

  public async post(
    input: Input_post,
    _client: Client
  ): Promise<Response | null> {
    const response = await axios.post(
      input.url,
      input.request ? input.request.body : undefined,
      input.request ? toAxiosRequestConfig(input.request) : undefined
    );
    return fromAxiosResponse(response);
  }
}
