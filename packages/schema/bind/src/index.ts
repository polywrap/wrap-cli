import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

import { BindOptions, BindOutput } from "./types";
import { getGenerateBindingFn } from "./bindings";

export * from "./types";
export * from "./bindings";

export function bindSchema(options: BindOptions): BindOutput {
  return getGenerateBindingFn(options.bindLanguage)(options);
}
