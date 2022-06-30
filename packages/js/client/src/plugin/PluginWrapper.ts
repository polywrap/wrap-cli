import {
  Wrapper,
  Client,
  GetManifestOptions,
  InvokeOptions,
  InvocableResult,
  PluginModule,
  PluginPackage,
  Uri,
  AnyManifestArtifact,
  ManifestArtifactType,
  GetFileOptions,
  Env,
  msgpackDecode,
  isBuffer,
} from "@polywrap/core-js";
import { Tracer } from "@polywrap/tracing-js";

export class PluginWrapper extends Wrapper {
  private _instance: PluginModule<unknown> | undefined;

  private _sanitizedEnv: Record<string, unknown> | undefined = undefined;

  constructor(
    private _uri: Uri,
    private _plugin: PluginPackage<unknown>,
    private _clientEnv?: Env<Uri>
  ) {
    super();

    Tracer.startSpan("PluginWrapper: constructor");
    Tracer.setAttribute("args", {
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
  ): Promise<Uint8Array | string> {
    throw Error("client.getFile(...) is not implemented for Plugins.");
  }

  @Tracer.traceMethod("PluginWrapper: invoke")
  public async invoke(
    options: InvokeOptions<Uri>,
    client: Client
  ): Promise<InvocableResult<unknown>> {
    try {
      const { method } = options;
      const args = options.args || {};
      const module = this._getInstance();

      if (!module) {
        throw new Error(`PluginWrapper: module "${module}" not found.`);
      }

      if (!module.getMethod(method)) {
        throw new Error(`PluginWrapper: method "${method}" not found.`);
      }

      // Sanitize & load the module's environment
      await this._sanitizeAndLoadEnv(client, module);

      let jsArgs: Record<string, unknown>;

      // If the args are a msgpack buffer, deserialize it
      if (isBuffer(args)) {
        const result = msgpackDecode(args);

        Tracer.addEvent("msgpack-decoded", result);

        if (typeof result !== "object") {
          throw new Error(
            `PluginWrapper: decoded MsgPack args did not result in an object.\nResult: ${result}`
          );
        }

        jsArgs = result as Record<string, unknown>;
      } else {
        jsArgs = args;
      }

      // Invoke the function
      try {
        const result = await module._wrap_invoke(method, jsArgs, client);

        if (result !== undefined) {
          const data = result as unknown;

          Tracer.addEvent("Result", data);

          return {
            data: data,
            encoded: false,
          };
        } else {
          return { };
        }
      } catch (e) {
        throw Error(
          `PluginWrapper: invocation exception encountered.\n` +
            `uri: ${this._uri.uri}\nmodule: ${module}\n` +
            `method: ${method}\n` +
            `args: ${JSON.stringify(jsArgs, null, 2)}\n` +
            `exception: ${e.message}`
        );
      }
    } catch (error) {
      return {
        error
      };
    }
  }

  private _getInstance(): PluginModule<unknown> {
    this._instance ||= this._plugin.factory();
    return this._instance;
  }

  @Tracer.traceMethod("PluginWrapper: _sanitizeAndLoadEnv")
  private async _sanitizeAndLoadEnv(
    client: Client,
    pluginModule: PluginModule<unknown>
  ): Promise<void> {
    if (this._sanitizedEnv === undefined) {
      const clientEnv = this._getClientEnv();
      this._sanitizedEnv = await pluginModule._wrap_sanitize_env(
        clientEnv,
        client
      );
    }

    pluginModule._wrap_load_env(this._sanitizedEnv || {});
  }

  @Tracer.traceMethod("PluginWrapper: _getClientEnv")
  private _getClientEnv(): Record<string, unknown> {
    if (!this._clientEnv?.env) {
      return {};
    }
    return this._clientEnv.env;
  }
}
