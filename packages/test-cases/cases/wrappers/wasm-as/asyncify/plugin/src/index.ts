import { Client, Module, manifest, Args_getData, Args_setData } from "./wrap";

import { PluginFactory } from "@polywrap/core-js";

type NoConfig = Record<string, never>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MemoryStoragePlugin extends Module<NoConfig> {
  private _value: number;

  async getData(_: Args_getData, _client: Client): Promise<number> {
    await sleep(50);
    return this._value;
  }

  async setData(args: Args_setData, _client: Client): Promise<boolean> {
    await sleep(50);
    this._value = args.value;
    return true;
  }
}
export const memoryStoragePlugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new MemoryStoragePlugin({}),
    manifest,
  };
};

export const plugin = MemoryStoragePlugin;
