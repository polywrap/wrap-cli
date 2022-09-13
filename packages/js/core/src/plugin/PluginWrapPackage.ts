import { IWrapPackage, PluginPackage, Uri, Wrapper } from "../types";
import { PluginWrapper } from "./PluginWrapper";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

// TODO: this is a temporary solution until we refactor the plugin package to be an IWrapPackage
export class PluginWrapPackage implements IWrapPackage {
  constructor(
    public uri: Uri,
    private readonly pluginPackage: PluginPackage<unknown>
  ) {}

  async getManifest(): Promise<WrapManifest> {
    return this.pluginPackage.manifest;
  }

  async createWrapper(): Promise<Wrapper> {
    return new PluginWrapper(this.pluginPackage);
  }
}
