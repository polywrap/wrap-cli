import { Client } from "./Client";
import { Uri } from "./Uri";

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
 * Base config for PolywrapApp
 *
 * @param uri The uri used for queries within the Extension
 */
export interface BasePolywrapAppConfig {
  [p: string]: ExtensionConfig | undefined;
}

/**
 * PolywrapApp interface
 *
 * @param uri The uri used for queries within the Extension
 * @param config Configuration values for the extension
 */
export interface BasePolywrapApp {
  readonly client: Client;
}
