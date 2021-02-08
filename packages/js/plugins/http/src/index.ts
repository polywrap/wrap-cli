/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { Request, Response } from "./types";
import { fromAxiosResponse, toAxiosRequestConfig } from "./util";
import { manifest } from "./manifest";

import axios from "axios";
import {
  Client,
  Plugin,
  PluginModules,
  PluginManifest,
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
    const response = await axios.get<string>(
      url,
      toAxiosRequestConfig(request)
    );
    return fromAxiosResponse(response);
  }

  public async post(url: string, request: Request): Promise<Response> {
    const response = await axios.post(
      url,
      request.body,
      toAxiosRequestConfig(request)
    );
    return fromAxiosResponse(response);
  }
}
