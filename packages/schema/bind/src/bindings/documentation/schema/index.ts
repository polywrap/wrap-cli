import { GenerateBindingFn } from "../..";
import { BindOptions, BindOutput } from "../../..";

import Mustache from "mustache";
import path from "path";
import { readFileSync } from "fs";

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const result: BindOutput = {
    output: {
      entries: [],
    },
    outputDirAbs: options.outputDirAbs,
  };
  const output = result.output;

  const renderTemplate = (
    subPath: string,
    context: unknown,
    fileName: string
  ) => {
    const absPath = path.join(__dirname, subPath);
    const template = readFileSync(absPath, { encoding: "utf-8" });

    output.entries.push({
      type: "File",
      name: fileName,
      data: Mustache.render(template, context),
    });
  };

  // generate schema
  const schemaContext = {
    schema: options.schema,
  };
  renderTemplate(
    "./templates/schema.mustache",
    schemaContext,
    "generated-schema.graphql"
  );

  return result;
};
