/* eslint-disable @typescript-eslint/naming-convention */
import { PluginMethod } from "./PluginMethod";

import { WrapClient, WrapErrorCode } from "@polywrap/wrap-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export abstract class PluginModule<
  TConfig,
  TEnv extends Record<string, unknown> = Record<string, unknown>
> {
  private _env: TEnv;
  private _config: TConfig;

  constructor(config: TConfig) {
    this._config = config;
  }

  public get env(): TEnv {
    return this._env;
  }

  public get config(): TConfig {
    return this._config;
  }

  public setEnv(env: TEnv): void {
    this._env = env;
  }

  public async _wrap_invoke<
    TArgs extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(
    method: string,
    args: TArgs,
    client: WrapClient
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

  public getMethod<
    TArgs extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(method: string): PluginMethod<TArgs, TResult> | undefined {
    const fn:
      | PluginMethod<TArgs, TResult>
      | undefined = ((this as unknown) as Record<
      string,
      PluginMethod<TArgs, TResult>
    >)[method];

    return fn?.bind(this);
  }
}
