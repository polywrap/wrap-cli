import { Http_Query } from "./w3/imported";
import { Input_catFile } from "./w3";

export function catFile(input: Input_catFile): Buffer {
  const catResponse = Http_Query.get({
    url: "",
    request: {
      headers: [],
      urlParams: [{key: "arg", value: input.cid}],
      responseType: "BINARY"
    }
  });

  if(catResponse.status == 200) {
    return new Buffer(catResponse.body);
  } else {
    throw new Error(`Failed to cat file: ${catResponse.status} ${catResponse.statusText}`);
  }
}

// export function tryResolveUri(input: Input_tryResolveUri): string {

// }

// export function getFile(input: Input_getFile): Buffer {

// }

// tryResolveUri(
//   authority: String!
//   path: String!
// ): ApiResolver_MaybeUriOrManifest

// getFile(
//   path: String!
// ): Bytes # TODO: https://github.com/Web3-API/prototype/issues/100
