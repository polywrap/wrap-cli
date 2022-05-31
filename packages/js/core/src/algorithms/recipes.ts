import { NamespacedRecipes, Recipe } from "../types";

/**
 *
 * @param {string | string[]} query
 * @param {string} delimiter
 * @returns {string[][]}
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
 *
 * @param {Record<string, unknown>} recipes
 * @param {Record<string, string>} constants
 * @returns {Record<string, unknown>}
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
 *
 * @param {NamespacedRecipes | (NamespacedRecipes & {[p: string]: string[]})} cookbook
 * @param {string[]} query
 * @returns {Recipe[]}
 */
export function resolveRecipeQuery(
  cookbook:
    | NamespacedRecipes
    | (NamespacedRecipes & { [menu: string]: string[] }),
  query: string[]
): Recipe[] {
  const val = query.reduce((acc, cur) => (acc as any)?.[cur], cookbook);
  if (val == null)
    throw new Error(
      `Failed to resolve recipe query: could not find ${query.join(".")}`
    );

  if (Array.isArray(val)) {
    if (typeof val[0] === "string")
      return parseRecipeQuery(val).flatMap((q) =>
        resolveRecipeQuery(cookbook, q)
      );
    else return val as Recipe[];
  } else
    return Object.entries(
      val as Record<string, NamespacedRecipes>
    ).flatMap(([k, v]) => resolveRecipeQuery(v, [k]));
}
