import {
  Args_get,
  Args_post,
  CoreClient,
  Http_Response,
  manifest,
  Module,
} from "./wrap";
import { addParams, fromFetchResponse } from "./util";

import fetch from "isomorphic-unfetch";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

type NoConfig = Record<string, never>;

export class HttpPlugin extends Module<NoConfig> {
  public async get(
    args: Args_get,
    _client: CoreClient
  ): Promise<Http_Response | null> {
    const url = addParams(args.url, args.request?.urlParams);
    const fetchResponse = await fetch(url, {
      method: "GET",
      headers: args.request?.headers
        ? Object.fromEntries(args.request?.headers)
        : undefined,
    });
    if (fetchResponse.status < 200 || fetchResponse.status >= 300) {
      throw new Error(
        `HTTP Error: Status: ${fetchResponse.status}; Message: ${fetchResponse.statusText}`
      );
    }
    return await fromFetchResponse(fetchResponse, args.request?.responseType);
  }

  public async post(
    args: Args_post,
    _client: CoreClient
  ): Promise<Http_Response | null> {
    const url = addParams(args.url, args.request?.urlParams);
    const fetchResponse = await fetch(url, {
      method: "POST",
      body: args.request?.body ?? undefined,
      headers: args.request?.headers
        ? Object.fromEntries(args.request?.headers)
        : undefined,
    });
    if (fetchResponse.status < 200 || fetchResponse.status >= 300) {
      throw new Error(
        `HTTP Error: Status: ${fetchResponse.status}; Message: ${fetchResponse.statusText}`
      );
    }
    return await fromFetchResponse(fetchResponse, args.request?.responseType);
  }
}

export const httpPlugin: PluginFactory<NoConfig> = () =>
  new PluginPackage(new HttpPlugin({}), manifest);

export const plugin = httpPlugin;
