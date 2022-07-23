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
} from "@polywrap/core-js";
import {
  deserializeWrapManifest,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import { Tracer } from "@polywrap/tracing-js";
import fs from "fs";

export class PluginWrapper extends Wrapper {
  private _instance: PluginModule<unknown> | undefined;
  private _info: WrapManifest | undefined;

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

  public async getFile(
    _options: GetFileOptions,
    _: Client
  ): Promise<Uint8Array | string> {
    const file = await fs.promises.readFile(_options.path);
    if (!file) {
      throw Error(
        `PluginWrapper: File was not found. \n Path: ${_options.path}`
      );
    }
    return file;
  }

  @Tracer.traceMethod("WasmWrapper: getManifest")
  public async getManifest(_: Client): Promise<WrapManifest> {
    if (this._info) {
      return this._info;
    }

    const moduleManifest = "./wrap.info";

    const data = (await this.getFile(
      { path: moduleManifest },
      _
    )) as Uint8Array;

    if (!data) {
      throw Error(`Package manifest does not contain information`);
    }

    this._info = ((await deserializeWrapManifest(
      data
    )) as unknown) as WrapManifest;
    return this._info as WrapManifest;
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
