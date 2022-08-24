import {
  BindOptions,
  BindOutput,
  GenerateBindingFn,
} from "@polywrap/schema-bind";
import Mustache from "mustache";
import path from "path";
import { readFileSync } from "fs";
import { renderSchema } from "@polywrap/schema-compose";

export const scriptPath = path.join(__dirname, "index.js");

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
    schema: renderSchema(options.abi, true),
  };
  renderTemplate(
    "./templates/schema.mustache",
    schemaContext,
    "generated-schema.graphql"
  );

  return result;
};
