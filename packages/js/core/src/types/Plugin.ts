/* eslint-disable @typescript-eslint/naming-convention */
import { Client, MaybeAsync, executeMaybeAsyncFunction, Uri } from ".";

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
> = (args: TArgs, client: Client) => MaybeAsync<TResult>;

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

/** The plugin package's manifest */
export interface PluginPackageManifest {
  /** The Wrapper's schema */
  schema: string;

  /** All interface schemas implemented by this plugin. */
  implements: Uri[];
}

export type PluginPackage<TConfig> = {
  factory: () => PluginModule<TConfig>;
  manifest: PluginPackageManifest;
};

export type PluginFactory<TConfig> = (
  config: TConfig
) => PluginPackage<TConfig>;
