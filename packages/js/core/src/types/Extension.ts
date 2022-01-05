import { Client } from "./Client";
import { Uri } from "./Uri";
import { InvokeApiOptions, InvokeApiResult } from "./Invoke";

/**
 * Executable Wrapper/Plugin Invocation
 *
 * @param config returns Input arguments for the Invocation, which can be used
 * as input to the client.invoke(...) method
 * @param execute Executes client.invoke(...) and returns the result
 */
export interface ExtensionInvocation<
  TData = unknown,
  TUri extends Uri | string = string
> {
  config: () => InvokeApiOptions<TUri>;
  execute: () => Promise<InvokeApiResult<TData>>;
}

/**
 * Base config for Extension, to be extended by a custom config interface.
 *
 * @param uri The uri used for queries within the Extension
 */
export interface ExtensionConfig {
  uri?: Uri | string;
}

/**
 * Extension interface
 *
 * @param uri The uri used for queries within the Extension
 * @param config Configuration values for the extension
 */
export interface Extension {
  readonly uri: Uri;
  config: ExtensionConfig;
}

/**
 * An ExtensionPackage holds an Extension factory and properties used to extend
 * the Client
 *
 * @param factory Produces Extension
 * @param namespace Namespace used to access Extension instance from client instance
 */
export type ExtensionPackage = {
  factory: (client: Client) => Extension;
  namespace: string;
};

export type ExtensionFactory<TOpts> = (opts: TOpts) => ExtensionPackage;
