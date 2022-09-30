import { IWrapPackage, PluginPackage, Uri, Wrapper } from "../types";
import { PluginWrapper } from "./PluginWrapper";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result, ResultOk } from "@polywrap/result";

// TODO: this is a temporary solution until we refactor the plugin package to be an IWrapPackage
export class PluginWrapPackage implements IWrapPackage {
  constructor(
    public uri: Uri,
    private readonly pluginPackage: PluginPackage<unknown>
  ) {}

  async getManifest(): Promise<Result<WrapManifest, Error>> {
    return ResultOk(this.pluginPackage.manifest);
  }

  async createWrapper(): Promise<Result<Wrapper, Error>> {
    return ResultOk(new PluginWrapper(this.pluginPackage));
  }
}
