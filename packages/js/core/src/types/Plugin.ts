/* eslint-disable @typescript-eslint/naming-convention */
import { Uri, Client, MaybeAsync, executeMaybeAsyncFunction } from ".";

/**
 * Invocable plugin method.
 *
 * @param input Input arguments for the method, structured as
 * a map, removing the chance of incorrectly ordering arguments.
 * @param client The client instance requesting this invocation.
 * This client will be used for any sub-queries that occur.
 */
export type PluginMethod<
  TInput extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown
> = (input: TInput, client: Client) => MaybeAsync<TResult>;

export abstract class PluginModule<
  TConfig extends Record<string, unknown> = Record<string, unknown>,
  TEnv extends Record<string, unknown> = Record<string, unknown>,
  TClientEnv extends Record<string, unknown> = TEnv
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

  public _w3_load_env(env: TEnv): void {
    this._env = env;
  }

  public async _w3_sanitize_env(
    clientEnv: TClientEnv,
    client: Client
  ): Promise<TEnv> {
    if (this.getMethod("sanitizeEnv")) {
      return this._w3_invoke<TClientEnv, TEnv>(
        "sanitizeEnv",
        clientEnv,
        client
      );
    } else {
      return Promise.resolve(clientEnv as TEnv);
    }
  }

  public async _w3_invoke<
    TInput extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(method: string, input: TInput, client: Client): Promise<TResult> {
    const fn = this.getMethod<TInput, TResult>(method);

    if (!fn) {
      throw Error("TODO: missing function");
    }

    if (typeof fn !== "function") {
      throw Error("TODO: ${method} must be a function");
    }

    return await executeMaybeAsyncFunction<TResult>(
      fn.bind(this, input, client)
    );
  }

  public getMethod<
    TInput extends Record<string, unknown> = Record<string, unknown>,
    TResult = unknown
  >(method: string): PluginMethod<TInput, TResult> | undefined {
    const fn:
      | PluginMethod<TInput, TResult>
      | undefined = ((this as unknown) as Record<
      string,
      PluginMethod<TInput, TResult>
    >)[method];

    return fn;
  }
}

/** The plugin's query "modules" */
export type PluginModules = {
  [module: string]: PluginModule;
};

/**
 * The plugin instance.
 */
export interface Plugin {
  /**
   * Get an instance of this plugin's modules.
   *
   * @param client The client instance requesting the modules.
   * This client will be used for any sub-queries that occur.
   */
  getModules(): PluginModules;
}

/** The plugin package's manifest */
export interface PluginPackageManifest {
  /** The API's schema */
  schema: string;

  /** All interface schemas implemented by this plugin. */
  implements: Uri[];
}

export type PluginPackage = {
  factory: () => Plugin;
  manifest: PluginPackageManifest;
};

export type PluginFactory<TOpts> = (opts: TOpts) => PluginPackage;
