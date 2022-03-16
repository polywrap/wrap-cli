import {
  Api,
  Cookbook,
  Env,
  InterfaceImplementations,
  InvokeHandler,
  PluginRegistration,
  QueryApiOptions,
  QueryApiResult,
  QueryHandler,
  ResolveUriOptions,
  SubscriptionHandler,
  Uri,
  UriRedirect,
} from "./";
import { AnyManifestArtifact, ManifestArtifactType } from "../manifest";
import {
  UriToApiResolver,
  ResolveUriError,
  UriResolutionHistory,
} from "../uri-resolution/core";

export interface ClientConfig<TUri extends Uri | string = string> {
  redirects: UriRedirect<TUri>[];
  plugins: PluginRegistration<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
  envs: Env<TUri>[];
  resolvers: UriToApiResolver[];
}

export interface Contextualized {
  contextId?: string;
}

/**
 * Options passed to the client when cooking recipes from a cookbook or wrapper.
 */
export interface CookRecipesOptions<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TUri extends Uri | string = string
> extends Contextualized {
  /**
   * The cookbook that should be queried against. If not provided, then a
   * `wrapperUri` must be provided instead, which itself must point to a wrapper
   * that has a valid cookbook in its meta manifest.
   */
  cookbook?: Cookbook<TUri>;
  /**
   * An optional list of one or more "queries", which are `.`-separated
   * namespaces of recipes in the cookbook. Queries are executed in the order
   * provided in the list; and, if the list is empty, all recipes are executed
   * in the order loaded from the file (this may be arbitrary and implementation
   * -dependent).
   */
  query?: string[];
  /**
   * A wrapper which contains a valid cookbook in its manifest. Not necessary if
   * querying from a cookbook file directly.
   */
  wrapperUri?: TUri;

  /**
   * An optional callback that is executed with the results of every `query`.
   *
   * @param {QueryApiOptions} recipe the recipe that was called
   * @param {QueryApiResult<TData>["data"]} data any data the call returned
   * @param {QueryApiResult<TData>["errors"]} errors any errors that arose
   */
  onExecution?(
    recipe: QueryApiOptions,
    data?: QueryApiResult<TData>["data"],
    errors?: QueryApiResult<TData>["errors"]
  ): void;
}

export type GetEnvsOptions = Contextualized;

export type GetResolversOptions = Contextualized;

export interface GetFileOptions extends Contextualized {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions extends Contextualized {
  applyRedirects?: boolean;
}

export type GetInterfacesOptions = Contextualized;

export interface GetManifestOptions<
  TManifestArtifactType extends ManifestArtifactType
> extends Contextualized {
  type: TManifestArtifactType;
}

export type GetPluginsOptions = Contextualized;

export type GetRedirectsOptions = Contextualized;

export type GetSchemaOptions = Contextualized;

export interface Client
  extends QueryHandler,
    SubscriptionHandler,
    InvokeHandler {
  /**
   * Cook some recipes from a cookbook, based on the passed options.
   *
   * Recipes are cooked asynchronously, in no determined order (all promises are
   * launched simultaneously). The caller may decide how to handle the promises
   * on their own terms.
   *
   * @param {CookRecipesOptions<TData>} options what to cook and how to cook it
   * @returns {Promise<QueryApiResult<TData>[]>} all the query promise handles
   *    bundled together into one parent promise.
   */
  cookRecipes<TData extends Record<string, unknown> = Record<string, unknown>>(
    options: CookRecipesOptions<TData>
  ): Promise<QueryApiResult<TData>[]>;

  /**
   * Cook some recipes from a cookbook, based on the passed options.
   *
   * Recipes are cook synchronously, in the order defined in the options. Each
   * recipe is allowed to finish cooking before the next one is started.
   *
   * @param {CookRecipesOptions<TData>} options what to cook and how to cook it
   * @returns {Promise<void>} an empty promise, once the last recipe has
   *    resolved.
   */
  cookRecipesSync<
    TData extends Record<string, unknown> = Record<string, unknown>
  >(
    options: CookRecipesOptions<TData>
  ): Promise<void>;

  getResolvers(options: GetResolversOptions): readonly UriToApiResolver[];

  getEnvByUri<TUri extends Uri | string>(
    uri: TUri,
    options: GetEnvsOptions
  ): Env<Uri> | undefined;

  getEnvs(options: GetEnvsOptions): readonly Env<Uri>[];

  getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | ArrayBuffer>;

  getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions
  ): TUri[];

  getInterfaces(
    options: GetInterfacesOptions
  ): readonly InterfaceImplementations<Uri>[];

  getManifest<
    TUri extends Uri | string,
    TManifestArtifactType extends ManifestArtifactType
  >(
    uri: TUri,
    options: GetManifestOptions<TManifestArtifactType>
  ): Promise<AnyManifestArtifact<TManifestArtifactType>>;

  getPlugins(options: GetPluginsOptions): readonly PluginRegistration<Uri>[];

  getRedirects(options: GetRedirectsOptions): readonly UriRedirect<Uri>[];

  getSchema<TUri extends Uri | string>(
    uri: TUri,
    options: GetSchemaOptions
  ): Promise<string>;

  resolveUri<TUri extends Uri | string>(
    uri: TUri,
    options?: ResolveUriOptions
  ): Promise<{
    api?: Api;
    uri?: Uri;
    uriHistory: UriResolutionHistory;
    error?: ResolveUriError;
  }>;
}
