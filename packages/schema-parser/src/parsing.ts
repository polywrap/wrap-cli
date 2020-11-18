import { TypeInfo, TypeInfoConfig } from "./types";
import { printSchemaWithDirectives } from "graphql-tools";
import { parse, buildSchema } from "graphql";

import { visitUserTypes } from "./visitors/user-types";
import { visitImportedQueryTypes } from "./visitors/imported-query-types";
import { visitImportedObjectTypes } from "./visitors/imported-object-types";
import { visitQueryTypes } from "./visitors/query-types";

export function buildTypeInfo(schema: string, config?: TypeInfoConfig): TypeInfo {

  const builtSchema = buildSchema(schema);
  const printedSchema = printSchemaWithDirectives(builtSchema);
  const astNode = parse(printedSchema);

  const info = new TypeInfo(config);
  visitUserTypes(astNode, info);
  visitImportedQueryTypes(astNode, info);
  visitImportedObjectTypes(astNode, info);
  visitQueryTypes(astNode, info);
  info.finalize();

  return info;
}
