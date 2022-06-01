import { NamespacedRecipes, Recipe } from "../types";

/**
 *
 * @param {string | string[]} query
 * @param {string} delimiter
 * @returns {string[][]}
 */
export function parseRecipeQuery(
  dishes: string[],
  menus: Record<string, string[]>
): string[][] {
  return dishes
    .map((dish) => (dish in menus ? menus[dish] : [dish]))
    .flatMap((dishes) => dishes.map((dish) => dish.split(".")));
}

/**
 *
 * @param {Record<string, unknown>} recipes
 * @param {Record<string, string>} constants
 * @returns {Record<string, unknown>}
 */
export function resolveConstants(
  variables: Record<string, unknown>,
  constants: Record<string, unknown>
): Record<string, unknown> {
  function resolveConstant(val: unknown): unknown {
    if (typeof val === "string" && val.startsWith("$")) {
      const resolvedVal = constants[val.slice(1)];
      if (resolvedVal !== undefined) return resolvedVal;
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
 * @param {NamespacedRecipes | (NamespacedRecipes & {[p: string]: string[]})} recipes
 * @param {string[]} dish
 * @returns {Recipe[]}
 */
export function resolveRecipeQuery(
  recipes:
    | NamespacedRecipes
    | (NamespacedRecipes & { [menu: string]: string[] }),
  dish: string[]
): Recipe[] {
  const val = dish.reduce((acc, cur) => {
    return (acc as Record<string, unknown>)?.[cur];
  }, recipes);
  if (!val)
    throw new Error(
      `Failed to resolve recipe query: could not find ${dish.join(".")}`
    );

  if (Array.isArray(val)) {
    // TODO: research is this possible?
    // if (typeof val[0] === "string")
    //   return parseRecipeQuery(val).flatMap((q) =>
    //     resolveRecipeQuery(cookbook, q)
    //   );
    return val as Recipe[];
  } else
    return Object.entries(
      val as Record<string, NamespacedRecipes>
    ).flatMap(([k, v]) => resolveRecipeQuery(v, [k]));
}
