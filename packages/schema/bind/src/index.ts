import { BindOptions, BindOutput } from "./types";
import { getGenerateBindingFn } from "./bindings";

import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export * from "./types";
export * from "./bindings";

export async function bindSchema(options: BindOptions): Promise<BindOutput> {
  return await getGenerateBindingFn(options.bindLanguage)(options);
}
