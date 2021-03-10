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

const FormData = require('form-data')

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
    let data: any;
    if(request.body?.formDataBody?.data) {
      const formData = new FormData()
      request.body.formDataBody.data.forEach(element => {
        formData.append(element.key, element.data);
      });
      data = formData;
    } else if(request.body?.rawBody) {
      data = request.body.rawBody;
    }

    const response = await axios.post(
      url,
      data,
      toAxiosRequestConfig(request)
    );
    return fromAxiosResponse(response);
  }
}
