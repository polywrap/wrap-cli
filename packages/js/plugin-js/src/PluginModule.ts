/* eslint-disable @typescript-eslint/naming-convention */
import { Client, executeMaybeAsyncFunction } from "@polywrap/core-js";

import { PluginMethod } from "./PluginMethod";

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
  >(method: string, args: TArgs, client: Client): Promise<TResult> {
    const fn = this.getMethod<TArgs, TResult>(method);

    if (!fn) {
      throw Error(`Plugin missing method "${method}"`);
    }

    if (typeof fn !== "function") {
      throw Error(`Plugin method "${method}" must be of type 'function'`);
    }

    return await executeMaybeAsyncFunction<TResult>(
      fn.bind(this, args, client)
    );
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

    return fn;
  }
}
