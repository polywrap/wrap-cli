import { NamespacedRecipes, Recipe } from "../types";

import yaml from "js-yaml";

/**
 * Returns the appropriate parser for the given file.
 *
 * Currently, `JSON` and `YAML` are supported.
 *
 * @param {string} path filepath to consider
 * @returns {(str: string) => any} a parser function which will take the contents of `path`
 *
 * @throws {@link URIError}
 * Thrown if the given path does not match one of the known parsers.
 */
export function getParserForFile<T>(
  path: string
): (str: string) => T | null | undefined {
  if (path.match(/\.ya?ml$/i))
    return yaml.load as (str: string) => T | undefined;
  else if (path.match(/\.json$/i)) return JSON.parse;
  else throw URIError(path);
}

/**
 * Given a query (either a string or an array of strings), return the array of
 * arrays of strings which represents the original input, split across the
 * `delimiter`.
 *
 * @param {string | string[]} query delimited string or list of strings
 * @param {string} delimiter what to split on, defaults to one space
 * @returns {string[][]} the list of lists of delimited strings.
 */
export function parseRecipeQuery(
  query: string | string[],
  delimiter = " "
): string[][] {
  return (Array.isArray(query) ? query : query.split(delimiter)).map((q) =>
    q.split(".")
  );
}

/**
 * Recursively resolves the constants in a given recipe structure.
 *
 * @param {Record<string, unknown>} variables recipes with constants
 * @param {Record<string, string>} constants a mapping of constants to values
 * @returns {Record<string, unknown>} the original `variables` with constants
 *    replaced.
 */
export function resolveConstants(
  variables: Record<string, unknown>,
  constants: Record<string, string>
): Record<string, unknown> {
  function resolveConstant(val: unknown): unknown {
    if (typeof val === "string" && val.startsWith("$")) {
      val = constants[val.slice(1)];
      if (val) return val;
      throw new ReferenceError(
        `${val} refers to a constant that isn't defined`
      );
    } else if (Array.isArray(val)) return val.map(resolveConstant);
    else if (typeof val === "object")
      return Object.entries(val as Record<string, unknown>).reduce(
        (o, [k, v]) => ((o[k] = resolveConstant(v)), o),
        {} as Record<string, unknown>
      );
    else return val;
  }

  return resolveConstant(variables) as Record<string, unknown>;
}

/**
 * Resolves a namespace (passed as a list of strings) within a nested recipe
 * structure. A general query (one that refers to any namespace that has
 * children) will return the results of all of the subqueries, recursively.
 *
 * @param {NamespacedRecipes | (NamespacedRecipes & {[p: string]: string[]})} cookbook nested recipes
 * @param {string[]} query which recipe to retrieve
 * @returns {Recipe[]} the recipes defined by the passed query.
 */
export function resolveRecipeQuery(
  cookbook:
    | NamespacedRecipes
    | (NamespacedRecipes & { [menu: string]: string[] }),
  query: string[]
): Recipe[] {
  const val = query.reduce((acc, cur) => acc?.[cur], cookbook);
  if (val == null)
    throw new Error(
      `Failed to resolve recipe query: could not find ${query.join(".")}`
    );

  if (Array.isArray(val)) {
    if (typeof val[0] === "string")
      return parseRecipeQuery((val as unknown) as string[]).flatMap((q) =>
        resolveRecipeQuery(cookbook, q)
      );
    else return val as Recipe[];
  } else
    return Object.entries(
      val as Record<string, NamespacedRecipes>
    ).flatMap(([k, v]) => resolveRecipeQuery(v, [k]));
}
