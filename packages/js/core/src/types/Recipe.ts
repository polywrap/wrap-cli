import { Uri } from "./";

/**
 * Recursive definition to support nested namespaces.
 */
export type NamespacedRecipes = {
  [namespace: string]: NamespacedRecipes | Recipe[];
};

/**
 * A `Recipe` consists of a query and optional variables to pass to the query.
 */
export interface Recipe {
  /**
   * A GraphQL query. Can be a path to a GraphQL file instead, in which case it
   * will get parsed and inserted as a string.
   */
  query: string;
  /**
   * Optional variables to pass to the GraphQL query.
   */
  variables?: Record<string, unknown>;
}

/**
 * A `Cookbook` file, which lists one or more namespaced recipes, the API which
 * those recipes should call against, any constants that might be replaced in
 * the recipes/variables (a string preceded by a `$`), and a list of named
 * "menus", which describe a list of recipes to be executed in a set order.
 */
export interface Cookbook<TUri extends Uri | string = string> {
  /**
   * Which wrapper to run the recipes against. If it's missing, but the cookbook
   * is bundled with a wrapper (or is in its manifest), defaults to that wrapper
   * being the implied API.
   */
  api?: TUri;
  /**
   * Any constants that should be replaced in the cookbook. Can either be a file
   * or a static mapping from strings to stringly-typed replacement values.
   */
  constants?: TUri | Record<string, string>;
  /**
   * Optional collection of multiple recipes/namespaces, to simplify procedural
   * calls or to give descriptive names to commonly-executed sequences.
   */
  menus?: Record<string, string[]>;
  /**
   * The namespaced recipes available in this cookbook to be called.
   */
  recipes: NamespacedRecipes;
}
