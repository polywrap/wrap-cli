import { Http_Query, Http_ResponseType } from "./w3/imported";
import {
  Input_catFile, Http_Header, Http_UrlParam, CatFileOptions, Http_ResponseError
} from "./w3";
import { decode } from "as-base64"
import { IpfsError } from "../error";

import { Nullable } from "@web3api/wasm-as";

export function catFile(input: Input_catFile): ArrayBuffer {
  const url = input.ipfsUrl + "/api/v0/cat";
  let headers: Http_Header[];
  let urlParams: Http_UrlParam[];
  let timeout: Nullable<u64>;

  urlParams = [{ key: "arg", value: input.cid }];

  if (input.catFileOptions) {
    const cfo = input.catFileOptions as CatFileOptions;
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

  const catResponse = Http_Query.get({
    url: url,
    request: {
      headers,
      urlParams,
      // TODO - Add response type as parameter to CatFileOptions
      // so response can be returned as string or binary data
      // depends on https://github.com/Web3-API/monorepo/issues/246
      responseType: Http_ResponseType.BINARY,
      body: null,
      timeout: timeout
    }
  });

  // no response - shouldn't happen
  if (catResponse == null) {
    throw new IpfsError("catFile", catResponse.status.value, catResponse.statusText);
  }

  // error happend in http plugin
  if(catResponse.error != null) {
    const err = catResponse.error as Http_ResponseError;
    if(err.timeoutExcided) {
      throw new IpfsError("catFile", null, null, "Timeout excided");
    } else {
      throw new IpfsError("catFile", null, null, err.errorMessage);
    }
  }

  // not 200 response error
  if (catResponse.status.value != 200) {
    throw new IpfsError("catFile", catResponse.status.value, catResponse.statusText);
  }

  return decode(catResponse.body as string).buffer;
}
