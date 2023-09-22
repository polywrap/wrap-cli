import { intlMsg } from "../../intl";

import path from "path";
import fs from "fs";

export function defaultSchemaPath(manifestPath: string): string {
  const defaultSchemaPaths = [
    "polywrap.graphql",
    "src/polywrap.graphql",
    "schema.graphql",
    "src/schema.graphql",
  ];
  const manifestDir = path.dirname(manifestPath);
  for (const relPath of defaultSchemaPaths) {
    const absPath = path.resolve(manifestDir, relPath);
    if (fs.existsSync(absPath)) {
      return absPath;
    }
  }

  throw Error(intlMsg.lib_project_no_default_schema());
}
