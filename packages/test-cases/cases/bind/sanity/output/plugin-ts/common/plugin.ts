/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import {
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  PluginModules,
} from "@web3api/core-js";
import { Query, QueryConfig } from "../";
import { Mutation, MutationConfig } from "../";
import { manifest } from "./manifest";

export interface TestCasePluginConfigs {
  query: QueryConfig;
  mutation: MutationConfig;
}

export class TestCasePlugin implements Plugin {
  constructor(private _configs: TestCasePluginConfigs) { }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: new Query(this._configs.query),
      mutation: new Mutation(this._configs.mutation),
    };
  }
}

export const testCasePlugin: PluginFactory<TestCasePluginConfigs> = (
  opts: TestCasePluginConfigs
) => {
  return {
    factory: () => new TestCasePlugin(opts),
    manifest: manifest,
  };
};

export const plugin = testCasePlugin;
