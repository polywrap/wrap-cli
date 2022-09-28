import { IWrapPackage, Wrapper } from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PluginModule } from "./PluginModule";
import { PluginWrapper } from "./PluginWrapper";
import { GetPluginMethodsFunc, PluginModuleWithMethods } from "./utils";

export class PluginPackage<TConfig> implements IWrapPackage {
  constructor(
    private pluginModule: PluginModule<TConfig>,
    private manifest: WrapManifest
  ) {}

  static from<TConfig>(
    pluginModule: PluginModule<TConfig>,
    manifest?: WrapManifest
  ): PluginPackage<never>;
  static from<TConfig>(
    getPluginFuncs: GetPluginMethodsFunc,
    manifest?: WrapManifest
  ): PluginPackage<TConfig>;
  static from<TConfig>(
    pluginModuleOrGetPluginFuncs: PluginModule<TConfig> | GetPluginMethodsFunc,
    manifest?: WrapManifest
  ): PluginPackage<TConfig> {
    if (typeof pluginModuleOrGetPluginFuncs === "function") {
      const getPluginFuncs = pluginModuleOrGetPluginFuncs as GetPluginMethodsFunc;

      return new PluginPackage<TConfig>(
        new PluginModuleWithMethods(getPluginFuncs),
        manifest || ({} as WrapManifest)
      ) as PluginPackage<TConfig>;
    } else {
      return new PluginPackage<TConfig>(
        pluginModuleOrGetPluginFuncs as PluginModule<TConfig>,
        manifest || ({} as WrapManifest)
      );
    }
  }

  async getManifest(): Promise<Result<WrapManifest, Error>> {
    return ResultOk(this.manifest);
  }

  async createWrapper(): Promise<Result<Wrapper, Error>> {
    return ResultOk(new PluginWrapper(this.manifest, this.pluginModule));
  }
}
