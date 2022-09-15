import { IWrapPackage, Wrapper } from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PluginModule } from "./PluginModule";
import { PluginWrapper } from "./PluginWrapper";

export class PluginPackage<TConfig> implements IWrapPackage {
  constructor(
    private manifest: WrapManifest,
    private pluginModule: PluginModule<TConfig>
  ) {}

  async getManifest(): Promise<WrapManifest> {
    return this.manifest;
  }

  async createWrapper(): Promise<Wrapper> {
    return new PluginWrapper(this.manifest, this.pluginModule);
  }
}
