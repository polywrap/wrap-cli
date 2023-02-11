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
  WrapError,
  WrapErrorCode,
} from "../.";
import { getErrorSource } from "./getErrorSource";

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
    _: GetFileOptions
  ): Promise<Result<Uint8Array | string, Error>> {
    return ResultErr(
      Error("client.getFile(...) is not implemented for Plugins.")
    );
  }

  @Tracer.traceMethod("PluginWrapper: getManifest")
  public getManifest(_?: GetManifestOptions): WrapManifest {
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
      const error = new WrapError("PluginWrapper: module not found.", {
        code: WrapErrorCode.WRAPPER_READ_FAIL,
        uri: options.uri.uri,
        method,
      });
      return ResultErr(error);
    }

    if (!module.getMethod(method)) {
      const error = new WrapError(`Plugin missing method "${method}"`, {
        code: WrapErrorCode.WRAPPER_METHOD_NOT_FOUND,
        uri: options.uri.uri,
        method,
      });
      return ResultErr(error);
    }

    // Set the module's environment
    await module.setEnv(options.env || {});

    let jsArgs: Record<string, unknown>;

    // If the args are a msgpack buffer, deserialize it
    if (isBuffer(args)) {
      const result = msgpackDecode(args);

      Tracer.addEvent("msgpack-decoded", result);

      if (typeof result !== "object") {
        const error = new WrapError(
          `Decoded MsgPack args did not result in an object.\nResult: ${result}`,
          {
            code: WrapErrorCode.WRAPPER_ARGS_MALFORMED,
            uri: options.uri.uri,
            method,
            args: JSON.stringify(args),
          }
        );
        return ResultErr(error);
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
        ...ResultOk(data),
        encoded: false,
      };
    } else {
      const code =
        (result.error as { code?: WrapErrorCode })?.code ??
        WrapErrorCode.WRAPPER_INVOKE_FAIL;
      const reason =
        result.error?.message ?? `Failed to invoke method "${method}"`;
      const error = new WrapError(reason, {
        code,
        uri: options.uri.toString(),
        method,
        args: JSON.stringify(jsArgs, null, 2),
        source: getErrorSource(result.error),
      });
      return ResultErr(error);
    }
  }

  private _getInstance(): PluginModule<unknown> {
    this._instance ||= this._plugin.factory();
    return this._instance;
  }
}
