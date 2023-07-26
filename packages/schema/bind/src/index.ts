import { BindOptions, BindOutput } from "./types";
import { getGenerateBindingFn } from "./bindings";
import * as WrapBindgen from "./bindings/wrap-bindgen";

import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export * from "./types";
export * from "./bindings";

export async function bindSchema(
  options: BindOptions,
  uri?: string
): Promise<BindOutput> {
  if (uri) {
    return WrapBindgen.getGenerateBindingFn(uri)(options);
  }
  return getGenerateBindingFn(options.bindLanguage)(options);
}
