import { Schema } from "../../";
import { Config } from "./types";
import { visitCustomTypes } from "./visitors/custom-types";
import { visitImportedTypes } from "./visitors/import-types";
import { visitQueryTypes } from "./visitors/query-types";

import { printSchemaWithDirectives } from "graphql-tools";
import { parse } from "graphql";

export function buildConfig(schema: Schema): Config {
  const config = new Config();

  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema);
  visitCustomTypes(astNode, config);
  visitImportedTypes(astNode, config);
  visitQueryTypes(astNode, config);
  config.finalize();

  return config;
}
