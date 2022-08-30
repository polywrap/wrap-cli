import {
  Wrapper,
  Client,
  InvokeOptions,
  InvocableResult,
  PluginModule,
  PluginPackage,
  Uri,
  GetFileOptions,
  Env,
  isBuffer,
  WrapManifest,
} from "../.";

import { msgpackDecode } from "@polywrap/msgpack-js";
import { Tracer, TracingLevel } from "@polywrap/tracing-js";

export class PluginWrapper extends Wrapper {
  private _instance: PluginModule<unknown> | undefined;

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

  public getUri(): Uri {
    return this._uri;
  }

  public getManifest(): WrapManifest {
    return this._plugin.manifest;
  }

  public getClientEnv(): Env<Uri> | undefined {
    return this._clientEnv;
  }

  @Tracer.traceMethod("PluginWrapper: invoke", TracingLevel.High)
  public async invoke(
    options: InvokeOptions<Uri>,
    client: Client
  ): Promise<InvocableResult<unknown>> {
    Tracer.setAttribute(
      "label",
      `Plugin Wrapper invoked: ${options.uri.uri}, with method ${options.method}`,
      TracingLevel.High
    );
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

      // Set the module's environment
      await module.setEnv(this._getClientEnv() || {});

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
        jsArgs = args as Record<string, unknown>;
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
          return {};
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
        error,
      };
    }
  }

  public async getFile(
    _: GetFileOptions,
    _client: Client
  ): Promise<Uint8Array | string> {
    throw Error("client.getFile(...) is not implemented for Plugins.");
  }

  private _getInstance(): PluginModule<unknown> {
    this._instance ||= this._plugin.factory();
    return this._instance;
  }

  @Tracer.traceMethod("PluginWrapper: _getClientEnv")
  private _getClientEnv(): Record<string, unknown> {
    if (!this._clientEnv?.env) {
      return {};
    }
    return this._clientEnv.env;
  }
}
