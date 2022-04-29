import { GenerateBindingFn, BindOptions, BindOutput } from "@web3api/schema-bind";
import { OutputDirectory } from "@web3api/os-js";
import Mustache from "mustache";
import path from "path";
import fs from "fs";

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const schema = options.modules[0].schema;
  const output: OutputDirectory = {
    entries: []
  };
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

  return {
    modules: [{
      name: "custom",
      outputDirAbs: __dirname,
      output,
    }]
  };
};
