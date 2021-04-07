import { Http_Query, Http_ResponseType, Http_Body } from "./w3/imported";
import { 
  Input_catFile, Http_Header, Http_UrlParam, CatFileOptions
} from "./w3";
import {decode} from "as-base64"
import { IpfsError } from "../error";

export function catFile(input: Input_catFile): ArrayBuffer {
  const url = input.ipfsUrl + "/api/v0/cat";
  let headers: Http_Header[];
  let urlParams: Http_UrlParam[];

  urlParams = [{key: "arg", value: input.cid}];
  
  if(input.catFileOptions) {
    let cfo = input.catFileOptions as CatFileOptions;
    if(cfo.headers) {
      headers = cfo.headers as Http_Header[];
    }
    if(cfo.queryString) {
      urlParams = urlParams.concat(cfo.queryString as Http_UrlParam[]);
    }
    if(cfo.length) {
      urlParams = urlParams.concat(
        [{key: "length", value: cfo.length.value.toString()} as Http_UrlParam]
      );
    }
    if(cfo.offset) {
      urlParams = urlParams.concat( 
        [{key: "offset", value: cfo.offset.value.toString()} as Http_UrlParam]
      )
    }
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
      body: null
    }
  });

  if(catResponse == null || catResponse.status != 200) {
    throw new IpfsError("catFile", catResponse.status, catResponse.statusText);
  }

  return decode(catResponse.body as string).buffer;
}
