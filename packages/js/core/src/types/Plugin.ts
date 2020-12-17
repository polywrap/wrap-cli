import {
  Uri,
  Client,
  ApiModules,
  MaybeAsync
} from "./";

/**
 * Invocable plugin method.
 * 
 * @param input Input arguments for the method, structured as
 * a map, removing the chance of incorrectly ordering arguments.
 * @param client The client instance requesting this invocation.
 * This client will be used for any sub-queries that occur.
 */
export type PluginMethod = (
  input: Record<string, unknown>,
  client: Client
) => MaybeAsync<unknown>;

/**
 * A plugin "module" is a named map of [[PluginMethod | invocable methods]].
 * The names of these methods map 1:1 with the schema's query methods.
 */
export type PluginModule = Record<string, PluginMethod>;

/** @ignore */
type PluginModulesType = {
  [module in ApiModules]?: PluginModule;
};

/** The plugin's query "modules" */
export interface PluginModules extends PluginModulesType { }

/** The plugin's configuration */
export interface PluginConfig {
  /** All API dependencies imported by this plugin. */
  imported?: Uri[];

  /** All abstract APIs implemented by this plugin. */
  implemented?: Uri[];
}

/**
 * The plugin instance.
*/
export abstract class Plugin {

  constructor(protected _pluginConfig: PluginConfig) { }

  /**
   * Check to see if the provided API is implemented by this plugin.
   * 
   * @param uri The API to check for in the `implemented` array.
   */
  public isImplemented(uri: Uri): boolean {
    return this._pluginConfig.implemented !== undefined &&
           this._pluginConfig.implemented.findIndex((item) => item.uri === uri.uri) > -1;
  }

  /** Get all APIs this plugin implemented. */
  public implemented(): readonly Uri[] {
    return this._pluginConfig.implemented || [];
  }

  /** Get all API dependencies imported by this plugin. */
  public imported(): readonly Uri[] {
    return this._pluginConfig.imported || [];
  }

  /**
   * Get an instance of this plugin's modules.
   * 
   * @param client The client instance requesting the modules.
   * This client will be used for any sub-queries that occur.
   */
  public abstract getModules(client: Client): PluginModules;
}
