import {
  Api,
  Client,
  filterResults,
  GetManifestOptions,
  InvokeApiOptions,
  InvokeApiResult,
  Plugin,
  PluginModule,
  PluginPackage,
  Uri,
  AnyManifestArtifact,
  ManifestArtifactType,
  GetFileOptions,
  Env,
  msgpackEncode,
  msgpackDecode,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export class PluginWeb3Api extends Api {
  private _instance: Plugin | undefined;

  private _sanitizedEnv: Record<string, unknown> | undefined = undefined;

  constructor(
    private _uri: Uri,
    private _plugin: PluginPackage,
    private _clientEnv?: Env<Uri>
  ) {
    super();

    Tracer.startSpan("PluginWeb3Api: constructor");
    Tracer.setAttribute("input", {
      uri: this._uri,
      plugin: this._plugin,
      clientEnv: this._clientEnv,
    });
    Tracer.endSpan();
  }

  public async getSchema(_client: Client): Promise<string> {
    return Promise.resolve(this._plugin.manifest.schema);
  }

  public async getManifest<T extends ManifestArtifactType>(
    _options: GetManifestOptions<T>,
    _client: Client
  ): Promise<AnyManifestArtifact<T>> {
    throw Error("client.getManifest(...) is not implemented for Plugins.");
  }

  public async getFile(
    _options: GetFileOptions,
    _client: Client
  ): Promise<ArrayBuffer | string> {
    throw Error("client.getFile(...) is not implemented for Plugins.");
  }

  @Tracer.traceMethod("PluginWeb3Api: invoke")
  public async invoke<TData = unknown>(
    options: InvokeApiOptions<Uri>,
    client: Client
  ): Promise<InvokeApiResult<TData>> {
    try {
      const { method, resultFilter } = options;
      const input = options.input || {};
      const module = this._getInstance().getModule();

      if (!module) {
        throw new Error(`PluginWeb3Api: module "${module}" not found.`);
      }

      if (!module.getMethod(method)) {
        throw new Error(`PluginWeb3Api: method "${method}" not found.`);
      }

      // Sanitize & load the module's environment
      await this._sanitizeAndLoadEnv(client, module);

      let jsInput: Record<string, unknown>;

      // If the input is a msgpack buffer, deserialize it
      if (input instanceof ArrayBuffer) {
        const result = msgpackDecode(input);

        Tracer.addEvent("msgpack-decoded", result);

        if (typeof result !== "object") {
          throw new Error(
            `PluginWeb3Api: decoded MsgPack input did not result in an object.\nResult: ${result}`
          );
        }

        jsInput = result as Record<string, unknown>;
      } else {
        jsInput = input;
      }

      // Invoke the function
      try {
        const result = (await module._w3_invoke(
          method,
          jsInput,
          client
        )) as TData;

        Tracer.addEvent("unfiltered-result", result);

        if (result !== undefined) {
          let data = result as unknown;

          if (process.env.TEST_PLUGIN) {
            // try to encode the returned result,
            // ensuring it's msgpack compliant
            try {
              msgpackEncode(data);
            } catch (e) {
              throw Error(
                `TEST_PLUGIN msgpack encode failure.` +
                  `uri: ${this._uri.uri}\nmodule: ${module}\n` +
                  `method: ${method}\n` +
                  `input: ${JSON.stringify(jsInput, null, 2)}\n` +
                  `result: ${JSON.stringify(data, null, 2)}\n` +
                  `exception: ${e}`
              );
            }
          }

          if (resultFilter) {
            data = filterResults(result, resultFilter);
          }

          Tracer.addEvent("Filtered result", data);

          return {
            data: data as TData,
          };
        } else {
          return {};
        }
      } catch (e) {
        throw Error(
          `PluginWeb3Api: invocation exception encountered.\n` +
            `uri: ${this._uri.uri}\nmodule: ${module}\n` +
            `method: ${method}\nresultFilter: ${resultFilter}\n` +
            `input: ${JSON.stringify(jsInput, null, 2)}\n` +
            `exception: ${e.message}`
        );
      }
    } catch (error) {
      return {
        error,
      };
    }
  }

  private _getInstance(): Plugin {
    this._instance ||= this._plugin.factory();
    return this._instance;
  }

  @Tracer.traceMethod("PluginWeb3Api: _sanitizeAndLoadEnv")
  private async _sanitizeAndLoadEnv(
    client: Client,
    pluginModule: PluginModule
  ): Promise<void> {
    if (this._sanitizedEnv === undefined) {
      const clientEnv = this._getModuleClientEnv();

      this._sanitizedEnv = await pluginModule._w3_sanitize_env(
        clientEnv,
        client
      );
    }

    pluginModule._w3_load_env(this._sanitizedEnv || {});
  }

  @Tracer.traceMethod("PluginWeb3Api: _getModuleClientEnv")
  private _getModuleClientEnv(): Record<string, unknown> {
    if (!this._clientEnv?.module) {
      return {};
    }
    return this._clientEnv.module;
  }
}
