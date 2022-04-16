import {
  Client,
  Module,
  Input_get,
  Input_post,
  Response,
} from "./w3-man";
import { fromAxiosResponse, toAxiosRequestConfig } from "./util";

import axios from "axios";

export interface QueryConfig { }

export class Query extends Module<QueryConfig> {

  public async get(input: Input_get, client: Client): Promise<Response | null> {
    const response = await axios.get<string>(
      input.url,
      input.request ? toAxiosRequestConfig(input.request) : undefined
    );
    return fromAxiosResponse(response);
  }

  public async post(input: Input_post, client: Client): Promise<Response | null> {
    const response = await axios.post(
      input.url,
      input.request ? input.request.body : undefined,
      input.request ? toAxiosRequestConfig(input.request) : undefined
    );
    return fromAxiosResponse(response);
  }
}
