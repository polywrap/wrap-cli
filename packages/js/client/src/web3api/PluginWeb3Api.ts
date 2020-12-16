import {
  Api,
  Client,
  filterResults,
  InvokeApiOptions,
  InvokeApiResult,
  Plugin,
  Uri
} from "@web3api/core-js";

export class PluginWeb3Api extends Api {

  private _instance: Plugin | undefined;

  constructor(
    uri: Uri,
    private _plugin: () => Plugin
  ) {
    super(uri);
  }

  private getInstance(): Plugin {
    return this._instance || this._plugin();
  }

  public async invoke<
    TData = Record<string, unknown>
  >(
    options: InvokeApiOptions, client: Client
  ): Promise<InvokeApiResult<TData>> {
    const { module, method, input, resultFilter } = options;
    const modules = this.getInstance().getModules(client);

    const pluginModule = modules[module];

    if (!pluginModule) {
      return {
        errors: [new Error(
          `Web3API module not found in plugin.` +
          `Module: ${module}\n` +
          `Plugin Modules: ${JSON.stringify(modules, null, 2)}\n` +
          `URI: ${this._uri}`
        )]
      };
    }

    if (!pluginModule[method]) {
      return {
        errors: [new Error(
          `Web3API method not found in the plugin's modules.` +
          `Module: ${module}\nMethod: ${method}\n` +
          `Plugin Modules: ${JSON.stringify(modules, null, 2)}\n` +
          `URI: ${this._uri}`
        )]
      };
    }

    let result;

    try {
      result = await pluginModule[method](input, client) as TData;
    } catch (e) {

    }

    if (result !== undefined) {
      // TODO: catch filterResults exception, append it to errors, add our own error saying "error filtering result on method ..."
      return {
        data: resultFilter ? filterResults(result, resultFilter) : result
      }
    } else {
      return { result }
    }
  }
}
