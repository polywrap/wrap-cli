import { Uri } from "./";

export type NamespacedRecipes = {
  [namespace: string]: NamespacedRecipes | Recipe[];
};

export interface Recipe {
  query: string;
  variables?: Record<string, unknown>;
}

export interface Cookbook<TUri extends Uri | string = string> {
  api?: TUri;
  constants?: TUri | Record<string, string>;
  menus?: Record<string, string[]>;
  recipes: NamespacedRecipes;
}
