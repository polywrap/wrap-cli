import { PluginModule } from "./PluginModule";
import { PluginWrapper } from "./PluginWrapper";
import { GetPluginMethodsFunc, PluginModuleWithMethods } from "./utils";

import { IWrapPackage, Wrapper } from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";

export class PluginPackage<
  TConfig,
  TEnv extends Record<string, unknown> = Record<string, unknown>
> implements IWrapPackage {
  constructor(
    private pluginModule: PluginModule<TConfig, TEnv>,
    private manifest: unknown
  ) {}

  static from<
    TConfig,
    TEnv extends Record<string, unknown> = Record<string, unknown>
  >(
    pluginModule: PluginModule<TConfig>,
    manifest?: unknown
  ): PluginPackage<TConfig, TEnv>;
  static from<TEnv extends Record<string, unknown> = Record<string, unknown>>(
    getPluginFuncs: GetPluginMethodsFunc<TEnv>,
    manifest?: unknown
  ): PluginPackage<never, TEnv>;
  static from<
    TConfig,
    TEnv extends Record<string, unknown> = Record<string, unknown>
  >(
    pluginModuleOrGetPluginFuncs:
      | PluginModule<TConfig>
      | GetPluginMethodsFunc<TEnv>,
    manifest?: unknown
  ): PluginPackage<TConfig, TEnv> {
    if (typeof pluginModuleOrGetPluginFuncs === "function") {
      const getPluginFuncs = pluginModuleOrGetPluginFuncs as GetPluginMethodsFunc<TEnv>;

      return new PluginPackage<TConfig, TEnv>(
        new PluginModuleWithMethods<TEnv>(getPluginFuncs),
        manifest || ({} as unknown)
      ) as PluginPackage<TConfig, TEnv>;
    } else {
      return new PluginPackage<TConfig, TEnv>(
        pluginModuleOrGetPluginFuncs as PluginModule<TConfig, TEnv>,
        manifest || ({} as unknown)
      );
    }
  }

  async getManifest(): Promise<Result<unknown, Error>> {
    return ResultOk(this.manifest);
  }

  async createWrapper(): Promise<Result<Wrapper, Error>> {
    return ResultOk(new PluginWrapper(this.manifest, this.pluginModule));
  }
}
