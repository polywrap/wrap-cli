import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import {latestWrapManifestVersion} from "@polywrap/wrap-manifest-types-js";
import {parseSchema} from "@polywrap/schema-parse";
import {Uri} from "@polywrap/core-js";

class MemoryStoragePlugin extends PluginModule<
  Record<string, unknown>
> {
  private _value: number;

  async getData(_: {}): Promise<number> {
    await this.sleep(50);
    return this._value;
  }

  async setData(args: { value: number }): Promise<boolean> {
    await this.sleep(50);
    this._value = args.value;
    return true;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const memoryStoragePlugin = () => {
  return PluginPackage.from(new MemoryStoragePlugin({}), {
    name: "memoryStorage",
    type: "plugin",
    version: latestWrapManifestVersion,
    abi: parseSchema(`
        type Module {
          getData: Int32!
          setData(value: Int32!): Boolean!
        }
      `)
  })
}
export const mockPluginRegistration = (uri: string | Uri) => {
  return {
    uri: Uri.from(uri),
    package: PluginPackage.from(
      () => ({
        simpleMethod: (_: unknown): string => {
          return "plugin response";
        },
        methodThatThrows: (_: unknown): string => {
          throw Error("I'm throwing!");
        },
        mockEnv(): { a: number } & Record<string, unknown> {
          return this.env;
        }
      })
    ),
  };
};

export type ErrResult<E = undefined> = { ok: false; error: E | undefined };