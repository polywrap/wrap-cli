import { Http_Query, Http_ResponseType, Http_Body } from "./w3/imported";
import { 
  Input_catToString,
  Input_catFile
} from "./w3";
import {decode} from "as-base64"

export const EmptyBody: Http_Body = {rawBody:"", formDataBody: {data: []}}

export function catToString(input: Input_catToString): String {
  const url = input.ipfsUrl + "/api/v0/cat";
  const catResponse = Http_Query.get({
    url: url,
    request: {
      headers: [],
      urlParams: [{key: "arg", value: input.cid}],
      responseType: Http_ResponseType.TEXT,
      body: EmptyBody,
    }
  });

  if(catResponse == null || catResponse.status != 200) {
    throw new Error(`Failed to cat file: ${catResponse?.status} ${catResponse?.statusText}`);
  }

  return catResponse.body;
}

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
    throw new Error(`Failed to cat file: ${catResponse?.status} ${catResponse?.statusText}`);
  }

  return decode(catResponse.body).buffer;
}
