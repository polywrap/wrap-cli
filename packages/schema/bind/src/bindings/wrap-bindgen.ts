import { BindOutput, BindOptions } from "../types";
import { GenerateBindingFn } from "./types";

import { PolywrapClient } from "@polywrap/client-js";

export function getGenerateBindingFn(
  uri: string
): GenerateBindingFn {
  return (options: BindOptions) =>
    invokeBindgenWrap(uri, options);
}

function invokeBindgenWrap(
  uri: string,
  options: BindOptions
): BindOutput {
  const client = new PolywrapClient();
  // NOTE: might need to serialize config & wrapInfo.abi to a string
  const result = client.invoke({
    uri,
    method: "generateBindings",
    args: {
      wrapInfo: options.wrapInfo,
      context: options.config
    }
  });
}
