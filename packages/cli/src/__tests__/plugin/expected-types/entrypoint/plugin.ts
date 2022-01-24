import { Plugin, PluginFactory, PluginPackageManifest, PluginModules, PluginModule } from "@web3api/core-js";
import { Query, QueryConfigs } from "../query/index";
import { Mutation, MutationConfigs } from "../mutation/index";
import { manifest } from "./manifest";

export interface PluginConfigs {
  query: QueryConfigs;
  mutation: MutationConfigs;
}

class MockPlugin extends Plugin {
  constructor(private _configs: PluginConfigs) {
    super();
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(): PluginModules {
    return {
      query: () => (((new Query(this._configs.query)) as unknown) as PluginModule),
      mutation: () => (((new Mutation(this._configs.mutation)) as unknown) as PluginModule),
    };
  }
}

export const mockPlugin: PluginFactory<PluginConfigs> = (
  opts: PluginConfigs
) => {
  return {
    factory: () => new MockPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = mockPlugin;