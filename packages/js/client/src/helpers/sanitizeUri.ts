import { Uri } from "@polywrap/core-js";

export function sanitizeUri<TUri extends Uri | string = string>(
  uri: TUri
): Uri {
  return typeof uri === "string" ? new Uri(uri) : (uri as Uri);
}
