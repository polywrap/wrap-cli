import {
  parseSchema,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType
} from "@web3api/schema-parse";
import { OutputDirectory } from "../..";
import * as Functions from "./functions";

export function generateBinding(schema: string): OutputDirectory {
  const typeInfo = parseSchema(schema, {
    transforms: [extendType(Functions), addFirstLast, toPrefixedGraphQLType]
  });

  return {
    entries: [
      {
        type: "File",
        name: "schema.ts",
        data: renderTemplate("./templates/schema.mustache", typeInfo)
      }
    ]
  }
}
