import { BindOptions, BindOutput } from "./types";
import { getGenerateBindingFn } from "./bindings";

// Remove mustache's built-in HTML escaping
// Handlebars.escape = (value) => value;

export * from "./types";
export * from "./bindings";

export function bindSchema(options: BindOptions): BindOutput {
  return getGenerateBindingFn(options.bindLanguage)(options);
}
