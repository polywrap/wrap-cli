import {
  CoreClient,
  Module,
  Args_get,
  Args_post,
  Http_Response,
  manifest,
} from "./wrap";
import { fromAxiosResponse, toAxiosRequestConfig } from "./util";

import axios from "axios";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

type NoConfig = Record<string, never>;

export class HttpPlugin extends Module<NoConfig> {
  public async get(
    args: Args_get,
    _client: CoreClient
  ): Promise<Http_Response | null> {
    const response = await axios.get<string>(
      args.url,
      args.request ? toAxiosRequestConfig(args.request) : undefined
    );
    return fromAxiosResponse(response);
  }

  public async post(
    args: Args_post,
    _client: CoreClient
  ): Promise<Http_Response | null> {
    const response = await axios.post(
      args.url,
      args.request ? args.request.body : undefined,
      args.request ? toAxiosRequestConfig(args.request) : undefined
    );
    return fromAxiosResponse(response);
  }
}

export const httpPlugin: PluginFactory<NoConfig> = () =>
  new PluginPackage(new HttpPlugin({}), manifest);

export const plugin = httpPlugin;
