import path from "path";
import { GluegunFilesystem } from "gluegun";

/**
 * Reads a nested cookbook and replaces query file URIs with the contents of the
 * file, in-place.
 *
 * @param recipes the `recipes` object, possibly containing queries as file URIs
 * @param {string} dir the current working directory to read files against
 * @param {GluegunFilesystem} fs filesystem instance to read files with
 */
export function resolveQueryFiles(
  recipes: any,
  dir: string,
  fs: GluegunFilesystem
): void {
  if (Array.isArray(recipes))
    recipes.forEach((r) => { // if it's a .graphql file try to read it
      if (typeof r.query === "string" && r.query.endsWith(".graphql")) {
        const fileContent = fs.read(path.join(dir, r.query));
        if (fileContent == null) throw new URIError(r.query);
        else r.query = fileContent;
      } // otherwise, leave it as-is and figure it out later down the line
    });
  else Object.values(recipes).forEach((v) => resolveQueryFiles(v, dir, fs));
}
