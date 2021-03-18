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
import { Tracer } from "@web3api/tracing";

export class PluginWeb3Api extends Api {
  private _instance: Plugin | undefined;

  constructor(private _uri: Uri, private _plugin: PluginPackage) {
    super();

    Tracer.startSpan("PluginWeb3Api constructor");

    Tracer.setAttribute("uri", this._uri);
    Tracer.setAttribute("plugin", this._plugin);
    Tracer.addEvent("Created");

    Tracer.endSpan();
  }

  public async invoke<TData = unknown>(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<TData>> {
    const { module, method, input, resultFilter } = options;
    const modules = this.getInstance().getModules(client);
    const pluginModule = modules[module];

    Tracer.startSpan("invoke");
    Tracer.setAttribute("options", options);

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
      Tracer.recordException(error);

      throw error;
    }

    Tracer.addEvent("Decoded", jsInput);

    try {
      const result = (await executeMaybeAsyncFunction(
        pluginModule[method],
        jsInput,
        client
      )) as TData;

      Tracer.addEvent("Result", result);

      if (result !== undefined) {
        let data = result as unknown;

        if (resultFilter) {
          data = filterResults(result, resultFilter);
        }

        Tracer.addEvent("Filtered result", data);
        Tracer.endSpan();

        return {
          data: data as TData,
        };
      } else {
        Tracer.endSpan();

        return {};
      }
    } catch (e) {
      Tracer.recordException(e);

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
