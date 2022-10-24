import { PluginModule, PluginMethod } from "..";

export type GetPluginMethodsFunc<
  TEnv extends Record<string, unknown> = Record<string, unknown>
> = (
  module: PluginModule<never, TEnv>
) => Record<string, PluginMethod<Record<string, unknown>, unknown>>;
