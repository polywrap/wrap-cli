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
import Web3APITracer from "@web3api/logger";

export class PluginWeb3Api extends Api {
  private _instance: Plugin | undefined;
  private _tracer: Web3APITracer;

  constructor(
    private _uri: Uri,
    private _plugin: PluginPackage,
    private _logEnabled: boolean = false
  ) {
    super();

    this._tracer = new Web3APITracer(this._logEnabled, "plugin-web3api");
    this._tracer.startSpan("constructor");

    this._tracer.setAttribute("uri", this._uri);
    this._tracer.setAttribute("plugin", this._plugin);
    this._tracer.addEvent("created");

    this._tracer.endSpan();
  }

  public async invoke<TData = unknown>(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<TData>> {
    const { module, method, input, resultFilter } = options;
    const modules = this.getInstance().getModules(client);
    const pluginModule = modules[module];

    this._tracer.startSpan("invoke");
    this._tracer.setAttribute("options", options);

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
      this._tracer.recordException(error);
      this._tracer.endSpan();

      throw error;
    }

    this._tracer.addEvent("decoded", jsInput);

    try {
      const result = (await executeMaybeAsyncFunction(
        pluginModule[method],
        jsInput,
        client
      )) as TData;

      this._tracer.addEvent("result", result);

      if (result !== undefined) {
        let data = result as unknown;

        if (resultFilter) {
          data = filterResults(result, resultFilter);
        }

        this._tracer.addEvent("filtered", data);
        this._tracer.endSpan();

        return {
          data: data as TData,
        };
      } else {
        this._tracer.endSpan();

        return {};
      }
    } catch (e) {
      this._tracer.recordException(e);

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
