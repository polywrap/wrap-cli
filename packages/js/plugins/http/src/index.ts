/* eslint-disable import/no-extraneous-dependencies */

import { query, mutation } from "./resolvers";
import { Request, Response } from "./types";
import { fromAxiosError, fromAxiosResponse, toAxiosRequest } from "./util";
import { manifest } from "./manifest";

import axios, { AxiosResponse } from "axios";
import {
  Client,
  Plugin,
  PluginModules,
  PluginManifest,
  PluginPackage,
} from "@web3api/core-js";

export class HttpPlugin extends Plugin {
  constructor() {
    super();
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  public getModules(_client: Client): PluginModules {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  public async get(url: string, request: Request): Promise<Response> {
    let response: AxiosResponse<string>;
    try {
      response = await axios.get<string>(
        url,
        toAxiosRequest(request).config
      );
    } catch (e) {
      return fromAxiosError(e);
    }
    return fromAxiosResponse(response);
  }

  public async post(url: string, request: Request): Promise<Response> {
    const axiosRequest = toAxiosRequest(request);
    const response = await axios.post(
      url,
      axiosRequest.data,
      axiosRequest.config
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
