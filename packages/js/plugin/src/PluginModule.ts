/* eslint-disable @typescript-eslint/naming-convention */
import { PluginMethod } from "./PluginMethod";

import { CoreClient, WrapErrorCode } from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export abstract class PluginModule<
  TConfig,
  TEnv extends Record<string, unknown> = Record<string, unknown>
> {
  private _config: TConfig;

  constructor(config: TConfig) {
    this._config = config;
  }

  public get config(): TConfig {
    return this._config;
  }

  public async _wrap_invoke<
    TArgs extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(
    method: string,
    args: TArgs,
    client: CoreClient,
    env: TEnv
  ): Promise<Result<TResult, Error>> {
    const fn = this.getMethod<TArgs, TResult, TEnv>(method);

    if (!fn) {
      return ResultErr(Error(`Plugin missing method "${method}"`));
    }

    if (typeof fn !== "function") {
      return ResultErr(
        Error(`Plugin method "${method}" must be of type 'function'`)
      );
    }

    try {
      const data = await fn(args, client, env);
      return ResultOk(data);
    } catch (e) {
      e.code = WrapErrorCode.WRAPPER_INVOKE_ABORTED;
      return ResultErr(e);
    }
  }

  public getMethod<
    TArgs extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown,
    TEnv extends Record<string, unknown> = Record<string, unknown>
  >(method: string): PluginMethod<TArgs, TResult> | undefined {
    const fn:
      | PluginMethod<TArgs, TResult, TEnv>
      | undefined = ((this as unknown) as Record<
      string,
      PluginMethod<TArgs, TResult, TEnv>
    >)[method];

    return fn?.bind(this);
  }
}
