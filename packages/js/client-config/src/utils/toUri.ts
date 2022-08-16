import { Uri } from "@polywrap/core-js";

export function toUri(uri: Uri | string): Uri {
  if (typeof uri === "string") {
    return new Uri(uri);
  } else {
    return uri;
  }
}
