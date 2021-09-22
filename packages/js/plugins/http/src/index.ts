/* eslint-disable import/no-extraneous-dependencies */

import { query } from "./resolvers";
import { fromAxiosError, fromAxiosResponse, toAxiosRequest } from "./util";
import { manifest, Response, Request, Query } from "./w3";

import axios, { AxiosResponse } from "axios";
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
    let response: AxiosResponse<string>;
    try {
      response = await axios.get<string>(
        url,
        request ? toAxiosRequest(request).config : undefined
      );
    } catch (e) {
      return fromAxiosError(e);
    }
    return fromAxiosResponse(response);
  }

  public async post(url: string, request?: Request): Promise<Response> {
    let response: AxiosResponse<string>;
    try {
      const axiosRequest = request ? toAxiosRequest(request) : undefined;
      response = await axios.post(
        url,
        axiosRequest ? axiosRequest.data : undefined,
        axiosRequest ? axiosRequest.config : undefined
      );
    } catch (e) {
      return fromAxiosError(e);
    }
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
