import { Http_Query, Http_ResponseType, Http_Body } from "./w3/imported";
import { 
  Input_catFile
} from "./w3";
import {decode} from "as-base64"

const EmptyBody: Http_Body = {rawBody:null, stringBody:null, formDataBody: {data: []}}

export function catFile(input: Input_catFile): ArrayBuffer {
  const url = input.ipfsUrl + "/api/v0/cat";
  const catResponse = Http_Query.get({
    url: url,
    request: {
      headers: [],
      urlParams: [{key: "arg", value: input.cid}],
      responseType: Http_ResponseType.BINARY,
      body: EmptyBody,
    }
  });

  if(catResponse == null || catResponse.status != 200) {
    throw new IpfsError("catFile", catResponse.status, catResponse.statusText);
  }

  return decode(catResponse.body).buffer;
}
