import {
  Api,
  Client,
  executeMaybeAsyncFunction,
  filterResults,
  InvokeApiOptions,
  InvokeApiResult,
  Plugin,
  PluginPackage,
  Uri,
} from "@web3api/core-js";
import { decode } from "@msgpack/msgpack";

export class PluginWeb3Api extends Api {
  private _instance: Plugin | undefined;

  constructor(private _uri: Uri, private _plugin: PluginPackage) {
    super();
  }

  public async invoke<TData = unknown>(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<TData>> {
    const { module, method, input, resultFilter } = options;
    const modules = this.getInstance().getModules(client);
    const pluginModule = modules[module];

    if (!pluginModule) {
      throw new Error(`PluginWeb3Api: module "${module}" not found.`);
    }

    if (!pluginModule[method]) {
      throw new Error(`PluginWeb3Api: method "${method}" not found.`);
    }

    let jsInput: Record<string, unknown>;

    // If the input is a msgpack buffer, deserialize it
    if (input instanceof ArrayBuffer) {
      const result = decode(input);

      if (typeof result !== "object") {
        throw new Error(
          `PluginWeb3Api: decoded MsgPack input did not result in an object.\nResult: ${result}`
        );
      }

      jsInput = result as Record<string, unknown>;
    } else {
      jsInput = input;
    }

    try {
      const result = (await executeMaybeAsyncFunction(
        pluginModule[method],
        jsInput,
        client
      )) as TData;

      if (result !== undefined) {
        let data = result as unknown;

        if (resultFilter) {
          data = filterResults(result, resultFilter);
        }

        return {
          data: data as TData,
        };
      } else {
        return {};
      }
    } catch (e) {
      return {
        error: new Error(
          `PluginWeb3Api: invocation exception encountered.\n` +
            `uri: ${this._uri.uri}\nmodule: ${module}\n` +
            `method: ${method}\nresultFilter: ${resultFilter}\n` +
            `input: ${JSON.stringify(jsInput, null, 2)}\n` +
            `modules: ${JSON.stringify(modules, null, 2)}\n` +
            `exception: ${e.message}`
        ),
      };
    }
  }

  public async getSchema(_client: Client): Promise<string> {
    return Promise.resolve(this._plugin.manifest.schema);
  }

  private getInstance(): Plugin {
    return this._instance || this._plugin.factory();
  }
}
