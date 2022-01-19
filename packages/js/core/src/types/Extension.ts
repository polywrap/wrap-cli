import { Client } from "./Client";
import { Uri } from "./Uri";

/**
 * Executable Wrapper/Plugin Invocation
 *
 * @param config returns Input arguments for the Invocation, which can be used
 * as input to the client.invoke(...) method
 * @param execute Executes client.invoke(...) and returns the result
 */
// export interface ExtensionInvocation<
//   TData = unknown,
//   TUri extends Uri | string = string
// > {
//   config: () => InvokeApiOptions<TUri>;
//   execute: () => Promise<InvokeApiResult<TData>>;
// }

/**
 * Base config for Extension
 *
 * @param uri The uri used for queries within the Extension
 */
export interface ExtensionConfig {
  uri?: Uri | string;
}

export interface SanitizedExtensionConfig extends ExtensionConfig {
  uri: Uri;
}

/**
 * Extension interface
 *
 * @param uri The uri used for queries within the Extension
 * @param config Configuration values for the extension
 */
export interface Extension {
  readonly buildUri: Uri;
  readonly config: SanitizedExtensionConfig;
}

/**
 * Base config for PolywrapDapp
 *
 * @param uri The uri used for queries within the Extension
 */
export interface BasePolywrapDappConfig {
  [p: string]: ExtensionConfig | undefined;
}

/**
 * PolywrapDapp interface
 *
 * @param uri The uri used for queries within the Extension
 * @param config Configuration values for the extension
 */
export interface BasePolywrapDapp {
  readonly client: Client;
}
