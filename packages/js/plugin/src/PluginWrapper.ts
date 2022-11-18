import { PluginModule } from "./PluginModule";

import {
  Wrapper,
  CoreClient,
  InvokeOptions,
  InvocableResult,
  Uri,
  GetFileOptions,
  isBuffer,
  WrapError,
  WrapErrorCode,
} from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import { Tracer, TracingLevel } from "@polywrap/tracing-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class PluginWrapper implements Wrapper {
  constructor(
    private manifest: WrapManifest,
    private module: PluginModule<unknown>
  ) {
    Tracer.startSpan("PluginWrapper: constructor");
    Tracer.setAttribute("args", {
      plugin: this.module,
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
  public getManifest(): WrapManifest {
    return this.manifest;
  }

  @Tracer.traceMethod("PluginWrapper: invoke", TracingLevel.High)
  public async invoke(
    options: InvokeOptions<Uri>,
    client: CoreClient
  ): Promise<InvocableResult<unknown>> {
    Tracer.setAttribute(
      "label",
      `Plugin Wrapper invoked: ${options.uri.uri}, with method ${options.method}`,
      TracingLevel.High
    );
    const { method } = options;
    const args = options.args || {};

    if (!this.module.getMethod(method)) {
      const error = new WrapError(`Method "${method}" not found.`, {
        code: WrapErrorCode.PLUGIN_METHOD_NOT_FOUND,
        uri: options.uri.uri,
        method,
      });
      return ResultErr(error);
    }

    // Set the module's environment
    this.module.setEnv(options.env || {});

    let jsArgs: Record<string, unknown>;

    // If the args are a msgpack buffer, deserialize it
    if (isBuffer(args)) {
      const result = msgpackDecode(args);

      Tracer.addEvent("msgpack-decoded", result);

      if (typeof result !== "object") {
        const error = new WrapError(
          `Decoded MsgPack args did not result in an object.\nResult: ${result}`,
          {
            code: WrapErrorCode.PLUGIN_ARGS_MALFORMED,
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
    const result = await this.module._wrap_invoke(method, jsArgs, client);

    if (result.ok) {
      const data = result.value;

      Tracer.addEvent("Result", data);

      return {
        ...ResultOk(data),
        encoded: false,
      };
    } else {
      const error = new WrapError(result.error?.message, {
        code: WrapErrorCode.PLUGIN_INVOKE_FAIL,
        uri: `${options.uri}; module: ${module}`,
        method,
        args: JSON.stringify(jsArgs, null, 2),
        cause: result.error,
      });
      return ResultErr(error);
    }
  }
}
