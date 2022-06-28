import { BindOptions, BindOutput } from "./types";
import { getGenerateBindingFn } from "./bindings";

import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export * from "./types";
export * from "./bindings";

export function bindSchema(options: BindOptions): BindOutput {
  // TODO: remove this post-release, this is needed to resolve the CLI<>plugin circular dependency
  options.abi = options.abi || (options as any).typeInfo;
  return getGenerateBindingFn(options.bindLanguage)(options);
}
