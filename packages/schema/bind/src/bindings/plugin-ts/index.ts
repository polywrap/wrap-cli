import { OutputDirectory } from "../..";
import * as Functions from "./functions";

import {
  parseSchema,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
} from "@web3api/schema-parse";
import Mustache from "mustache";
import { readFileSync } from "fs";
import path from "path";

export function generateBinding(schema: string): OutputDirectory {
  const typeInfo = parseSchema(schema, {
    transforms: [extendType(Functions), addFirstLast, toPrefixedGraphQLType],
  });

  const template = readFileSync(
    path.resolve(__dirname, "./templates/schema.mustache")
  );

  return {
    entries: [
      {
        type: "File",
        name: "schema.ts",
        data: Mustache.render(template.toString(), {
          ...typeInfo,
          schema,
        }),
      },
    ],
  };
}
