import {
  PluginFactory,
  PluginManifest
} from ".";

export interface PluginPackage {
  factory: PluginFactory;
  manifest: PluginManifest;
}
