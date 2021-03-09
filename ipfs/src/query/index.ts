import { Http_Query, Http_ResponseType } from "./w3/imported";
import { 
  Input_catToString,
  Input_catFile,
  Input_tryResolveUri,
  Input_getFile,
  Input_addFile,
  AddResult
} from "./w3";

export function catToString(input: Input_catToString): String {
  const url = input.ipfsUrl + "/api/v0/cat?arg=" + input.cid;
  const catResponse = Http_Query.get({
    url: url,
    request: {
      headers: [],
      urlParams: [{key: "arg", value: input.cid}],
      responseType: Http_ResponseType.TEXT,
      body: "",
    }
  });

  if(catResponse == null || catResponse.status != 200) {
    throw new Error(`Failed to cat file: ${catResponse.status} ${catResponse.statusText}`);
  }

  return catResponse.body;
}

export function catFile(input: Input_catFile): ArrayBuffer {
  const url = input.ipfsUrl + "/api/v0/cat?arg=" + input.cid;
  const catResponse = Http_Query.get({
    url: url,
    request: {
      headers: [],
      urlParams: [{key: "arg", value: input.cid}],
      responseType: Http_ResponseType.BINARY,
      body: "",
    }
  });
  if(catResponse == null) {
    throw new Error("")
  }
  return String.UTF8.encode(catResponse.body);
}

export function tryResolveUri(input: Input_tryResolveUri): string {
  return "";
}

export function getFile(input: Input_getFile): ArrayBuffer {
  return new ArrayBuffer(3);
}

export function addFile(input: Input_addFile): AddResult {
  return {cid: "", path: ""};
}
