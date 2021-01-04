import {
  Api,
  Client,
  executeMaybeAsyncFunction,
  filterResults,
  InvokeApiOptions,
  InvokeApiResult,
  Plugin,
  Uri,
} from "@web3api/core-js";

export class PluginWeb3Api extends Api {
  private _instance: Plugin | undefined;

  constructor(uri: Uri, private _plugin: () => Plugin) {
    super(uri);
  }

  public async invoke<TData = Record<string, unknown>>(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<TData>> {
    const { module, method, input, resultFilter } = options;
    const modules = this.getInstance().getModules(client);

    try {
      const pluginModule = modules[module];

      if (!pluginModule) {
        throw new Error(`PluginWeb3Api: module "${module}" not found.`);
      }

      if (!pluginModule[method]) {
        throw new Error(`PluginWeb3Api: method "${method}" not found.`);
      }

      const result = (await executeMaybeAsyncFunction(pluginModule[method], input, client)) as TData;

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
      let errors;
      if (Array.isArray(e)) {
        errors = [...e];
      } else {
        errors = [e];
      }

      errors.push(
        new Error(
          `PluginWeb3Api: invocation exception encountered.\n` +
            `uri: ${this._uri.uri}\nmodule: ${module}\n` +
            `method: ${method}\nresultFilter: ${resultFilter}` +
            `input: ${JSON.stringify(input, null, 2)}` +
            `modules: ${JSON.stringify(modules, null, 2)}\n`
        )
      );

      return { errors };
    }
  }

  private getInstance(): Plugin {
    return this._instance || this._plugin();
  }
}
