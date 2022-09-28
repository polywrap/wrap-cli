/* eslint-disable @typescript-eslint/naming-convention */

import { PluginMethod } from "../PluginMethod";
import { PluginModule } from "../PluginModule";
import { GetPluginMethodsFunc } from "./GetPluginMethodsFunc";

import { Client, executeMaybeAsyncFunction } from "@polywrap/core-js";

export class PluginModuleWithMethods<
  TEnv extends Record<string, unknown> = Record<string, unknown>
> extends PluginModule<never, TEnv> {
  constructor(private getPluginMethods: GetPluginMethodsFunc) {
    super({} as never);
  }

  async _wrap_invoke<
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

  getMethod<
    TArgs extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(method: string): PluginMethod<TArgs, TResult> | undefined {
    const fn: PluginMethod<TArgs, TResult> | undefined = this.getPluginMethods(
      this
    )[method] as PluginMethod<TArgs, TResult>;

    return fn;
  }
}
