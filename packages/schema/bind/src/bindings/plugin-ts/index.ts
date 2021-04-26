import { OutputDirectory } from "../..";

import { TypeInfo } from "@web3api/schema-parse";
import Mustache from "mustache";
import { readFileSync } from "fs";
import path from "path";

export function generateBinding(typeInfo: TypeInfo): OutputDirectory {
  const template = readFileSync(
    path.resolve(__dirname, "./templates/schema.mustache")
  );

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
