/* eslint-disable @typescript-eslint/naming-convention */
import { MaybeAsync } from "./utils/MaybeAsync";

import { WrapClient } from "@polywrap/wrap-js";

/**
 * Invocable plugin method.
 *
 * @param args Arguments for the method, structured as
 * a map, removing the chance of incorrectly ordering arguments.
 * @param client The client instance requesting this invocation.
 * This client will be used for any sub-invokes that occur.
 */
export type PluginMethod<
  TArgs extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown
> = (args: TArgs, client: WrapClient) => MaybeAsync<TResult>;
