import { ClientConfig, QueryApiOptions, QueryApiResult, Uri } from "./";
import { MaybeAsync } from "./MaybeAsync";

export type NamespacedRecipes = {
  [namespace: string]: NamespacedRecipes | Recipe[];
};

export interface Recipe {
  query: string;
  variables?: Record<string, unknown>;
}

export interface Cookbook<TUri extends Uri | string = string> {
  api?: TUri;
  constants?: Record<string, string>;
  menus?: Record<string, string[]>;
  recipes: NamespacedRecipes;
}

export interface CookRecipesOptions<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
> {
  cookbook: Cookbook<TUri>;
  query?: string[];
  wrapperUri?: TUri;
  config?: Partial<TClientConfig>;
  contextId?: string;

  onExecution?(
    recipe: QueryApiOptions,
    data?: QueryApiResult<TData>["data"],
    errors?: QueryApiResult<TData>["errors"]
  ): MaybeAsync<void>;
}

export interface RecipeHandler {
  cookRecipes<TData extends Record<string, unknown> = Record<string, unknown>>(
    options: CookRecipesOptions<TData>
  ): Promise<void>;

  cookRecipesSync<
    TData extends Record<string, unknown> = Record<string, unknown>
  >(
    options: CookRecipesOptions<TData>
  ): Promise<void>;
}
