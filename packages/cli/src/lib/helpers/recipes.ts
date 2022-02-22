import path from "path";
import yaml from "js-yaml";
import { GluegunFilesystem } from "gluegun";

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
export function getParserForFile(path: string): (str: string) => any {
  if (!!path.match(/\.ya?ml$/i)) return yaml.load;
  else if (!!path.match(/\.json$/i)) return JSON.parse;
  else throw URIError(path);
}

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
