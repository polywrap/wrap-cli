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
    const axiosConfig = toAxiosRequestConfig(request)
    
    let data: any;
    if(request.body?.formDataBody?.data) {
      // body is defined as form data
      const formData = new FormData()
      request.body.formDataBody.data.forEach(element => {
        formData.append(element.key, element.data);
      });
      data = formData;
      // set up appropriate headers for form data
      axiosConfig.headers = {
        ...axiosConfig.headers,
        ...formData.getHeaders(),
      }
    } else if(request.body?.rawBody) {
      // body is defined as raw string
      data = request.body.rawBody;
    }

    const response = await axios.post(
      url,
      data,
      axiosConfig
    );

    return fromAxiosResponse(response);
  }
}
