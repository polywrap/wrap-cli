import {
  Uri,
  Client,
  InvokableModules,
  MaybeAsync,
  SchemaDocument
} from ".";

/** The plugin's configuration */
export interface PluginManifest {

  /** The API's schema */
  schema: SchemaDocument;

  /** All API dependencies imported by this plugin. */
  imported: Uri[];

  /** All abstract APIs implemented by this plugin. */
  implemented: Uri[];
}

/**
 * Invocable plugin method.
 *
 * @param input Input arguments for the method, structured as
 * a map, removing the chance of incorrectly ordering arguments.
 * @param client The client instance requesting this invocation.
 * This client will be used for any sub-queries that occur.
 */
export type PluginMethod = (input: Record<string, unknown>, client: Client) => MaybeAsync<unknown>;

/**
 * A plugin "module" is a named map of [[PluginMethod | invocable methods]].
 * The names of these methods map 1:1 with the schema's query methods.
 */
export type PluginModule = Record<string, PluginMethod>;

/** @ignore */
type PluginModulesType = {
  [module in InvokableModules]?: PluginModule;
};

/** The plugin's query "modules" */
export type PluginModules = PluginModulesType;

/**
 * The plugin instance.
 */
export abstract class Plugin {

  /**
   * Get an instance of this plugin's modules.
   *
   * @param client The client instance requesting the modules.
   * This client will be used for any sub-queries that occur.
   */
  public abstract getModules(client: Client): PluginModules;
}

export type PluginFactory = () => Plugin;

export interface PluginPackage {
  factory: PluginFactory;
  manifest: PluginManifest;
}
