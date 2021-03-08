import { Http_Mutation } from "./w3/imported";
import { Input_catFile } from "./w3";

export function catFile(input: Input_catFile): ArrayBuffer {
  const url = input.ipfsUrl + "/api/v0/cat?arg=" + input.cid;
  const catResponse = Http_Mutation.post({
    url: url,
    request: {
      headers: [],
      urlParams: [{key: "arg", value: input.cid}],
      responseType: "BINARY",
      body: "",
    }
  });

  if(catResponse == null || catResponse.status != 200) {
    throw new Error(`Failed to cat file: ${catResponse.status} ${catResponse.statusText}`);
  }

  return String.UTF8.encode(catResponse.body);
}
