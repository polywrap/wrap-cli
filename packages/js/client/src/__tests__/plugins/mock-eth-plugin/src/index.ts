import { mutation, query } from "./resolvers";
import { manifest, Query, String, Mutation } from "./w3";

import { Plugin, PluginPackage, PluginPackageManifest } from "@web3api/core-js";

export class MockPlugin extends Plugin {
  getModules(): {
    query: Query.Module;
    mutation: Mutation.Module;
  } {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }
  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public callContractView(_: Query.Input_callContractView): String {
    return "420";
  }

  public deployContract(_: Mutation.Input_deployContract): String {
    return "0x10";
  }
}

export const mockPlugin = (): PluginPackage => ({
  factory: () => new MockPlugin(),
  manifest,
});

export const plugin = mockPlugin;
