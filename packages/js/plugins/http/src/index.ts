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
  PluginFactory,
} from "@web3api/core-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const formData = require("form-data");

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
    const axiosConfig = toAxiosRequestConfig(request);
    let data: unknown = "";
    if (request.body) {
      if (request.body.formDataBody.data.length > 0) {
        // body is defined as form data
        const fd = new formData();
        request.body.formDataBody.data.forEach((element) => {
          fd.append(element.key, element.data);
        });
        data = fd;
        // set up appropriate headers for form data
        axiosConfig.headers = {
          ...axiosConfig.headers,
          ...fd.getHeaders(),
        };
      } else if (request.body.stringBody) {
        data = request.body.stringBody;
      } else if (request.body.rawBody) {
        data = request.body.rawBody;
      }
    }

    const response = await axios.post(url, data, axiosConfig);

    return fromAxiosResponse(response);
  }
}

export const httpPlugin: PluginFactory<Record<string, never>> = () => {
  return {
    factory: () => new HttpPlugin(),
    manifest: manifest,
  };
};
export const plugin = httpPlugin;
