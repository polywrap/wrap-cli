import { Http_Query, Http_ResponseType } from "./w3/imported";
import {
  Input_catFile, Input_catFileToString, Http_Header, 
  Http_UrlParam, CatFileOptions, Http_ResponseError, 
  Http_Request, ResolveResult, Input_resolve
} from "./w3";
import { decode } from "as-base64"
import { IpfsError } from "../error";

import { Nullable } from "@web3api/wasm-as";
import { IpfsOptions } from "./w3/IpfsOptions";

export function catFileToString(input: Input_catFileToString): String {
  const result = executeOperation(
    input.ipfs,
    createRequest(input.catFileOptions, input.cid, Http_ResponseType.TEXT),
    "catFileToString",
    "/api/v0/cat"
  );
  return result.data;
}

export function catFile(input: Input_catFile): ArrayBuffer {
  const result = executeOperation(
    input.ipfs,
    createRequest(input.catFileOptions, input.cid, Http_ResponseType.BINARY),
    "catFile",
    "/api/v0/cat"
  );
  return decode(result.data).buffer;
}

export function resolve(input: Input_resolve): ResolveResult {
  const result = executeOperation(
    input.ipfs,
    createRequest(null, input.cid, Http_ResponseType.TEXT),
    "resolve",
    "/api/v0/resolve"
  );
  return {cid: result.data, provider: result.provider}
}

class ExecutionResult {
  data: string;
  provider: string;
}

function executeOperation(
  ipfs: IpfsOptions,
  request: Http_Request,
  operation: string,
  operationUrl: string
): ExecutionResult {
  const provider = ipfs.provider;
  const fallbackProviders = ipfs.fallbackProviders != null ? ipfs.fallbackProviders as string[] : [];

  let complete = false;
  let fallbackIdx = -1;
  let result: string;

  while (!complete) {
    const url = provider + operationUrl;
    const response = Http_Query.get({
      url: url,
      request: request
    });

    // no response - shouldn't happen
    if (response == null) {
      throw new IpfsError(operation, response.status.value, response.statusText);
    }

    // error happend in http plugin
    if (response.error != null) {
      const err = response.error as Http_ResponseError;
      if (err.timeoutExcided) {
        fallbackIdx += 1;
        if (fallbackIdx >= fallbackProviders.length) {
          complete = true;
        }
        continue;
      } else {
        throw new IpfsError(operation, null, null, err.errorMessage);
      }
    }

    // not 200 response error
    if (response.status.value != 200) {
      throw new IpfsError(operation, response.status.value, response.statusText);
    }

    // succesfull request
    result = response.body as string;
    complete = true;
  }

  if (!result) {
    throw new IpfsError("Timeout has been exceeded, and all providers have been exhausted."); // TODO
  }

  return { data: result, provider }
}

function createRequest(catFileOptions: CatFileOptions | null, cid: string, responseType: Http_ResponseType): Http_Request {
  let headers: Http_Header[];
  let urlParams: Http_UrlParam[];
  let timeout: Nullable<u32>;

  urlParams = [{ key: "arg", value: cid }];

  if (catFileOptions) {
    const cfo = catFileOptions as CatFileOptions;
    if (cfo.headers) {
      headers = cfo.headers as Http_Header[];
    }
    if (cfo.queryString) {
      urlParams = urlParams.concat(cfo.queryString as Http_UrlParam[]);
    }
    if (cfo.length) {
      urlParams = urlParams.concat(
        [{ key: "length", value: cfo.length.value.toString() } as Http_UrlParam]
      );
    }
    if (cfo.offset) {
      urlParams = urlParams.concat(
        [{ key: "offset", value: cfo.offset.value.toString() } as Http_UrlParam]
      )
    }
    timeout = cfo.timeout;
  }

  return {
    headers,
    urlParams,
    // TODO - Add response type as parameter to CatFileOptions
    // so response can be returned as string or binary data
    // depends on https://github.com/Web3-API/monorepo/issues/246
    responseType: responseType,
    body: null,
    timeout: timeout
  }
}
