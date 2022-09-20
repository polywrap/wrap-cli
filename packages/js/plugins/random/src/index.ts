import {
  Module,
  Args_getRandom,
  manifest
} from "./wrap";

import randomBytes from "randombytes";
import { PluginFactory } from "@polywrap/core-js";

type NoConfig = Record<string, never>;

export class RandomPlugin extends Module<NoConfig> {
  public getRandom(args: Args_getRandom): Uint8Array {
    return new Uint8Array(randomBytes(args.len));
  }
}

export const randomPlugin: PluginFactory<NoConfig> = () => {
  return {
    factory: () => new RandomPlugin({}),
    manifest: manifest
  };
};

export const plugin = randomPlugin;
