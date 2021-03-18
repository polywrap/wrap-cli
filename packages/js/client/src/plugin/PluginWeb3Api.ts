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
import Logger from "@web3api/logger";

export class PluginWeb3Api extends Api {
  private _instance: Plugin | undefined;

  constructor(private _uri: Uri, private _plugin: PluginPackage) {
    super();

    Logger.startSpan("PluginWeb3Api constructor");

    Logger.setAttribute("uri", this._uri);
    Logger.setAttribute("plugin", this._plugin);
    Logger.addEvent("Created");

    Logger.endSpan();
  }

  public async invoke<TData = unknown>(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<TData>> {
    const { module, method, input, resultFilter } = options;
    const modules = this.getInstance().getModules(client);
    const pluginModule = modules[module];

    Logger.startSpan("invoke");
    Logger.setAttribute("options", options);

    let jsInput: Record<string, unknown>;

    try {
      if (!pluginModule) {
        throw new Error(`PluginWeb3Api: module "${module}" not found.`);
      }

      if (!pluginModule[method]) {
        throw new Error(`PluginWeb3Api: method "${method}" not found.`);
      }

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
    } catch (error) {
      Logger.recordException(error);

      throw error;
    }

    Logger.addEvent("Decoded", jsInput);

    try {
      const result = (await executeMaybeAsyncFunction(
        pluginModule[method],
        jsInput,
        client
      )) as TData;

      Logger.addEvent("Result", result);

      if (result !== undefined) {
        let data = result as unknown;

        if (resultFilter) {
          data = filterResults(result, resultFilter);
        }

        Logger.addEvent("Filtered result", data);
        Logger.endSpan();

        return {
          data: data as TData,
        };
      } else {
        Logger.endSpan();

        return {};
      }
    } catch (e) {
      Logger.recordException(e);

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
