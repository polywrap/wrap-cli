import { BindOptions, BindOutput } from "./types";
import { getGenerateBindingFn } from "./bindings";

export * from "./types";
export * from "./bindings";

export async function bindSchema(options: BindOptions): Promise<BindOutput> {
  return await getGenerateBindingFn(options.bindLanguage)(options);
}
