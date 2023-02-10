/* eslint-disable @typescript-eslint/naming-convention */

import { PluginMethod } from "../PluginMethod";
import { PluginModule } from "../PluginModule";
import { GetPluginMethodsFunc } from "./GetPluginMethodsFunc";

import { CoreClient, WrapErrorCode } from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class PluginModuleWithMethods<
  TEnv extends Record<string, unknown> = Record<string, unknown>
> extends PluginModule<never, TEnv> {
  constructor(private _getPluginMethods: GetPluginMethodsFunc<TEnv>) {
    super({} as never);
  }

  async _wrap_invoke<
    TArgs extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(
    method: string,
    args: TArgs,
    client: CoreClient
  ): Promise<Result<TResult, Error>> {
    const fn = this.getMethod<TArgs, TResult>(method);

    if (!fn) {
      return ResultErr(Error(`Plugin missing method "${method}"`));
    }

    if (typeof fn !== "function") {
      return ResultErr(
        Error(`Plugin method "${method}" must be of type 'function'`)
      );
    }

    try {
      const data = await fn(args, client);
      return ResultOk(data);
    } catch (e) {
      e.code = WrapErrorCode.WRAPPER_INVOKE_ABORTED;
      return ResultErr(e);
    }
  }

  getMethod<
    TArgs extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(method: string): PluginMethod<TArgs, TResult> | undefined {
    const fn: PluginMethod<TArgs, TResult> | undefined = this._getPluginMethods(
      this
    )[method] as PluginMethod<TArgs, TResult>;

    return fn?.bind(this);
  }
}
