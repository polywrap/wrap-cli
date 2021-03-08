import { Http_Query, Http_ResponseType } from "./w3/imported";
import { Input_catToString } from "./w3";

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
