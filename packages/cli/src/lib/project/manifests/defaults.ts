import path from "path";
import fs from "fs";

export function defaultSchemaPath(manifestPath: string): string {
  const defaultSchemaPaths = ["polywrap.graphql", "src/polywrap.graphql"];
  for (const relPath of defaultSchemaPaths) {
    const absPath = path.resolve(manifestPath, relPath);
    if (fs.existsSync(absPath)) {
      return absPath;
    }
  }

  throw Error(
    "Couldn't find schema in default paths. Please specify the schema location in the project manifest."
  );
}
