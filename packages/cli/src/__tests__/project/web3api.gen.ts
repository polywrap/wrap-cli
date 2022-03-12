import { OutputDirectory } from "@web3api/schema-bind";
import { TypeInfo } from "@web3api/schema-parse";
import Mustache from "mustache";
import path from "path";
import fs from "fs";

export function generateBinding(
  output: OutputDirectory,
  typeInfo: TypeInfo,
  schema: string,
  config: Record<string, unknown>
) {
  const schemaTemplate = fs.readFileSync(
    path.join(__dirname, "/templates/schema.mustache"),
    "utf-8"
  );

  output.entries.push({
    type: "File",
    name: "./schema1.ts",
    data: Mustache.render(schemaTemplate, { schema }),
  });

  output.entries.push({
    type: "Directory",
    name: "./folder",
    data: [
      {
        type: "File",
        name: "./schema2.ts",
        data: Mustache.render(schemaTemplate, { schema }),
      },
    ],
  });

  output.entries.push({
    type: "Template",
    name: "./schema3.ts",
    data: "./templates/schema.mustache",
  });
};
