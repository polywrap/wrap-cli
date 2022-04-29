/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules,
} from "@web3api/core-js";
import { Query, QueryConfig } from "../query";
import { manifest } from "./manifest";

export interface TestPluginConfigs {
  query: QueryConfig;
}

export class TestPlugin implements Plugin {
  constructor(private _configs: TestPluginConfigs) { }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
    };
  }
}

export const testPlugin: PluginFactory<TestPluginConfigs> = (
  opts: TestPluginConfigs
) => {
  return {
    factory: () => new TestPlugin(opts),
    manifest: manifest,
  };
};

export const plugin = testPlugin;
