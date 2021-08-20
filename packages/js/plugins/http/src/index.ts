/* eslint-disable import/no-extraneous-dependencies */
import { query } from "./resolvers";
import { fromAxiosResponse, toAxiosRequestConfig } from "./util";
import { manifest, Response, Request, Query } from "./w3";

import axios from "axios";
import {
  Client,
  Plugin,
  PluginPackageManifest,
  PluginPackage,
} from "@web3api/core-js";

export class HttpPlugin extends Plugin {
  constructor() {
    super();
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(
    _client: Client
  ): {
    query: Query.Module;
  } {
    return {
      query: query(this),
    };
  }

  public async get(url: string, request?: Request): Promise<Response> {
    const response = await axios.get<string>(
      url,
      request ? toAxiosRequestConfig(request) : undefined
    );
    return fromAxiosResponse(response);
  }

  public async post(url: string, request?: Request): Promise<Response> {
    const response = await axios.post(
      url,
      request ? request.body : undefined,
      request ? toAxiosRequestConfig(request) : undefined
    );
    return fromAxiosResponse(response);
  }
}

export const httpPlugin = (): PluginPackage => {
  return {
    factory: () => new HttpPlugin(),
    manifest: manifest,
  };
};
export const plugin = httpPlugin;
