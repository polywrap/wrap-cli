import { 
  Plugin, 
  PluginFactory, 
  PluginPackageManifest, 
  PluginModules, 
  PluginModule, 
  InvokableModules 
} from "@web3api/core-js";
import { loadEnv as loadQueryEnv, QueryEnv } from "../query/w3";
import { Query, QueryConfigs } from "../query";
import { loadEnv as loadMutationEnv, MutationEnv } from "../mutation/w3";
import { Mutation, MutationConfigs } from "../mutation";
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
      query: ((new Query(this._configs.query)) as unknown) as PluginModule,
      mutation: ((new Mutation(this._configs.mutation)) as unknown) as PluginModule,
    };
  }

  public loadModuleEnv(module: InvokableModules, env: unknown ): void {
    switch(module) {
      case "query":
        return loadQueryEnv(env as QueryEnv);
      case "mutation":
        return loadMutationEnv(env as MutationEnv);
      default:
        throw new Error(`Unknown module: ${module}`);
    }
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