import {
  QueryHandler,
  InvokeHandler,
  SubscriptionHandler,
  UriRedirect,
  Uri,
  PluginRegistration,
  InterfaceImplementations,
  Env,
  QueryApiOptions,
  QueryApiResult,
  Cookbook,
} from "./";
import { ManifestType, AnyManifest } from "../manifest";

export interface ClientConfig<TUri extends Uri | string = string> {
  redirects: UriRedirect<TUri>[];
  plugins: PluginRegistration<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
  envs: Env<TUri>[];
}

export interface Contextualized {
  contextId?: string;
}

export interface CookRecipesOptions<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TUri extends Uri | string = string
> extends Contextualized {
  cookbook?: Cookbook<TUri>;
  onExecution?(
    recipe: QueryApiOptions,
    data?: QueryApiResult<TData>["data"],
    errors?: QueryApiResult<TData>["errors"]
  ): void;
  query?: string[];
  wrapperUri?: TUri;
}

export type GetEnvsOptions = Contextualized;

export interface GetFileOptions extends Contextualized {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions extends Contextualized {
  applyRedirects?: boolean;
}

export type GetInterfacesOptions = Contextualized;

export interface GetManifestOptions<TManifestType extends ManifestType>
  extends Contextualized {
  type: TManifestType;
}

export type GetPluginsOptions = Contextualized;

export type GetRedirectsOptions = Contextualized;

export type GetSchemaOptions = Contextualized;

export interface Client
  extends QueryHandler,
    SubscriptionHandler,
    InvokeHandler {
  cookRecipes<TData extends Record<string, unknown> = Record<string, unknown>>(
    options: CookRecipesOptions<TData>
  ): Promise<QueryApiResult<TData>>[];

  cookRecipesSync<
    TData extends Record<string, unknown> = Record<string, unknown>
  >(
    options: CookRecipesOptions<TData>
  ): Promise<void>;

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

  getManifest<TUri extends Uri | string, TManifestType extends ManifestType>(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ): Promise<AnyManifest<TManifestType>>;

  getPlugins(options: GetPluginsOptions): readonly PluginRegistration<Uri>[];

  getRedirects(options: GetRedirectsOptions): readonly UriRedirect<Uri>[];

  getSchema<TUri extends Uri | string>(
    uri: TUri,
    options: GetSchemaOptions
  ): Promise<string>;
}
