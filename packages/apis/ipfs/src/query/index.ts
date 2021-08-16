import { Http_Query, Http_ResponseType } from "./w3/imported";
import {
  Input_catFile, Input_catFileToString, Http_Header, Http_UrlParam, CatFileOptions, Http_ResponseError, Http_Request, Http_Response
} from "./w3";
import { decode } from "as-base64"
import { IpfsError } from "../error";

import { Nullable } from "@web3api/wasm-as";

function createRequest(catFileOptions: CatFileOptions | null, cid: string, responseType: Http_ResponseType): Http_Request {
  let headers: Http_Header[];
  let urlParams: Http_UrlParam[];
  let timeout: Nullable<u64>;

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

function getResponseContent(response: Http_Response | null): string {
  // no response - shouldn't happen
  if (response == null) {
    throw new IpfsError("catFile", response.status.value, response.statusText);
  }

  // error happend in http plugin
  if(response.error != null) {
    const err = response.error as Http_ResponseError;
    if(err.timeoutExcided) {
      throw new IpfsError("catFile", null, null, "Timeout excided");
    } else {
      throw new IpfsError("catFile", null, null, err.errorMessage);
    }
  }

  // not 200 response error
  if (response.status.value != 200) {
    throw new IpfsError("catFile", response.status.value, response.statusText);
  }

  return response.body as string;
}

export function catFileToString(input: Input_catFileToString): String {
  const url = input.ipfsUrl + "/api/v0/cat";
  const catResponse = Http_Query.get({
    url: url,
    request: createRequest(input.catFileOptions, input.cid, Http_ResponseType.TEXT)
  });

  return getResponseContent(catResponse);
}

export function catFile(input: Input_catFile): ArrayBuffer {
  const url = input.ipfsUrl + "/api/v0/cat";
  const catResponse = Http_Query.get({
    url: url,
    request: createRequest(input.catFileOptions, input.cid, Http_ResponseType.BINARY)
  });

  return decode(getResponseContent(catResponse)).buffer;
}
