import { BindOptions, BindOutput } from "./types";
import { getGenerateBindingFn } from "./bindings";

import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export * from "./types";
export * from "./bindings";

export function bindSchema(options: BindOptions): BindOutput {
  return getGenerateBindingFn(options.bindLanguage)(options);
}
