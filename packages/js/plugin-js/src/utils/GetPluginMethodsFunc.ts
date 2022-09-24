import { PluginModule, PluginMethod } from "..";

export type GetPluginMethodsFunc = (
  module: PluginModule<never>
) => Record<string, PluginMethod<Record<string, unknown>, unknown>>;
