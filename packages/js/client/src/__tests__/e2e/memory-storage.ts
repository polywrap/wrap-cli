import { CoreClient } from "@polywrap/core-js";
import {
  PluginFactory,
  PluginModule,
  PluginPackage,
} from "@polywrap/plugin-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

type NoConfig = Record<string, never>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const makeMemoryStoragePlugin: PluginFactory<NoConfig> = () => {
  class MemoryStoragePlugin extends PluginModule<NoConfig> {
    private _value: number;

    async getData(_: {}, _client: CoreClient): Promise<number> {
      await sleep(50);
      return this._value;
    }

    async setData(
      args: { value: number },
      _client: CoreClient
    ): Promise<boolean> {
      await sleep(50);
      this._value = args.value;
      return true;
    }
  }

  return new PluginPackage(new MemoryStoragePlugin({}), {} as WrapManifest);
};
