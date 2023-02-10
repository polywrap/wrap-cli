import { PluginModule } from "./PluginModule";
import { getErrorSource } from "./utils/getErrorSource";

import {
  Wrapper,
  CoreClient,
  InvokeOptions,
  InvocableResult,
  GetFileOptions,
  isBuffer,
  WrapError,
  WrapErrorCode,
} from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class PluginWrapper implements Wrapper {
  constructor(
    private _manifest: WrapManifest,
    private _module: PluginModule<unknown>
  ) {}

  public async getFile(
    _: GetFileOptions
  ): Promise<Result<Uint8Array | string, Error>> {
    return ResultErr(
      Error("client.getFile(...) is not implemented for Plugins.")
    );
  }

  public getManifest(): WrapManifest {
    return this._manifest;
  }

  public async invoke(
    options: InvokeOptions,
    client: CoreClient
  ): Promise<InvocableResult<unknown>> {
    const { method } = options;
    const args = options.args || {};

    if (!this._module.getMethod(method)) {
      const error = new WrapError(`Plugin missing method "${method}"`, {
        code: WrapErrorCode.WRAPPER_METHOD_NOT_FOUND,
        uri: options.uri.uri,
        method,
      });
      return ResultErr(error);
    }

    // Set the module's environment
    this._module.setEnv(options.env || {});

    let jsArgs: Record<string, unknown>;

    // If the args are a msgpack buffer, deserialize it
    if (isBuffer(args)) {
      const result = msgpackDecode(args);

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
    const result = await this._module._wrap_invoke(method, jsArgs, client);

    if (result.ok) {
      const data = result.value;

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
}
