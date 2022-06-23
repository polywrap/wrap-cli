import {
  Client,
  Module,
  Input_get,
  Input_post,
  Response,
  manifest,
} from "./wrap";
import { fromAxiosResponse, toAxiosRequestConfig } from "./util";

import axios from "axios";
import { PluginFactory } from "@polywrap/core-js";

export type HttpPluginConfig = Record<string, unknown>;

export class HttpPlugin extends Module<HttpPluginConfig> {
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

export const httpPlugin: PluginFactory<HttpPluginConfig> = (
  opts: HttpPluginConfig
) => {
  return {
    factory: () => new HttpPlugin(opts),
    manifest,
  };
};

export const plugin = httpPlugin;
