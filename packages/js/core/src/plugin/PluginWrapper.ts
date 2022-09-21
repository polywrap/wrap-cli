import {
  Wrapper,
  Client,
  InvokeOptions,
  InvocableResult,
  PluginModule,
  PluginPackage,
  Uri,
  GetFileOptions,
  GetManifestOptions,
  isBuffer,
} from "../.";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import { Tracer, TracingLevel } from "@polywrap/tracing-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class PluginWrapper implements Wrapper {
  private _instance: PluginModule<unknown> | undefined;

  constructor(private _plugin: PluginPackage<unknown>) {
    Tracer.startSpan("PluginWrapper: constructor");
    Tracer.setAttribute("args", {
      plugin: this._plugin,
    });
    Tracer.endSpan();
  }

  public async getFile(
    _: GetFileOptions,
    _client: Client
  ): Promise<Result<Uint8Array | string, Error>> {
    return ResultErr(
      Error("client.getFile(...) is not implemented for Plugins.")
    );
  }

  @Tracer.traceMethod("PluginWrapper: getManifest")
  public getManifest(_: GetManifestOptions, _client: Client): WrapManifest {
    return this._plugin.manifest;
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
    const { method } = options;
    const args = options.args || {};
    const module = this._getInstance();

    if (!module) {
      return {
        data: ResultErr(Error(`PluginWrapper: module "${module}" not found.`)),
      };
    }

    if (!module.getMethod(method)) {
      return {
        data: ResultErr(Error(`PluginWrapper: method "${method}" not found.`)),
      };
    }

    // Set the module's environment
    await module.setEnv(options.env || {});

    let jsArgs: Record<string, unknown>;

    // If the args are a msgpack buffer, deserialize it
    if (isBuffer(args)) {
      const result = msgpackDecode(args);

      Tracer.addEvent("msgpack-decoded", result);

      if (typeof result !== "object") {
        const msgPackException = Error(
          `PluginWrapper: decoded MsgPack args did not result in an object.\nResult: ${result}`
        );
        return { data: ResultErr(msgPackException) };
      }

      jsArgs = result as Record<string, unknown>;
    } else {
      jsArgs = args as Record<string, unknown>;
    }

    // Invoke the function
    const result = await module._wrap_invoke(method, jsArgs, client);

    if (result.ok) {
      const data = result.value;

      Tracer.addEvent("Result", data);

      return {
        data: ResultOk(data),
        encoded: false,
      };
    } else {
      const invocationException = Error(
        `PluginWrapper: invocation exception encountered.\n` +
          `uri: ${options.uri}\nmodule: ${module}\n` +
          `method: ${method}\n` +
          `args: ${JSON.stringify(jsArgs, null, 2)}\n` +
          `exception: ${result.error?.message}`
      );
      return { data: ResultErr(invocationException) };
    }
  }

  private _getInstance(): PluginModule<unknown> {
    this._instance ||= this._plugin.factory();
    return this._instance;
  }
}
