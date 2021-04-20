import {
  parseSchema,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
} from "@web3api/schema-parse";
import { OutputDirectory } from "../..";
import * as Functions from "./functions";
import Mustache from "mustache";
import { readFileSync } from "fs";

export function generateBinding(schema: string): OutputDirectory {
  const typeInfo = parseSchema(schema, {
    transforms: [extendType(Functions), addFirstLast, toPrefixedGraphQLType],
  });

  const template = readFileSync("./templates/schema.mustache");

  return {
    entries: [
      {
        type: "File",
        name: "schema.ts",
        data: Mustache.render(template.toString(), typeInfo),
      },
    ],
  };
}
