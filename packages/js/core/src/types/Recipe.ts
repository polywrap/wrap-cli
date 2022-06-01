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
  api: TUri;
  recipes: NamespacedRecipes;
  constants?: Record<string, unknown>;
  menus?: Record<string, string[]>;
}

export interface CookRecipesOptions<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
> {
  cookbook: Cookbook<TUri>;
  dishes?: string[];
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
