import {
  Uri,
  Plugin
} from ".";

export type PluginFactory = () => Plugin;

export interface PluginLazyFactory {
  create: PluginFactory;
  implements: Uri[] | null;
}

export type AnyPluginFactory = PluginFactory | PluginLazyFactory;
