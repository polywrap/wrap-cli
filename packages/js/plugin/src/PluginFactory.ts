import { PluginPackage } from "./PluginPackage";

export type PluginFactory<TConfig> = (
  config: TConfig
) => PluginPackage<TConfig>;
