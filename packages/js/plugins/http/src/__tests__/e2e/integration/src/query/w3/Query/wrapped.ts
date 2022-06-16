import {
  get,
  post
} from "../../index";
import {
  deserializegetArgs,
  serializegetResult,
  deserializepostArgs,
  serializepostResult
} from "./serialization";

export function getWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetArgs(argsBuf);
  const result = get({
    url: args.url,
    request: args.request
  });
  return serializegetResult(result);
}

export function postWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializepostArgs(argsBuf);
  const result = post({
    url: args.url,
    request: args.request
  });
  return serializepostResult(result);
}
