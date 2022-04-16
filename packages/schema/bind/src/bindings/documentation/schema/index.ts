import { GenerateBindingFn } from "../..";
import { extractCommonTypeInfo } from "../../utils/typeInfo";
import {
  BindOptions,
  BindOutput,
  BindModuleOutput,
  BindModuleOptions,
} from "../../..";

import Mustache from "mustache";
import path from "path";
import { readFileSync } from "fs";

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const result: BindOutput = {
    modules: [],
  };

  if (options.bindLanguage === "wasm-as") {
    // If there's more than one module provided
    if (options.modules.length > 1 && options.commonDirAbs) {
      // Extract the common types
      const commonTypeInfo = extractCommonTypeInfo(
        options.modules,
        options.commonDirAbs
      );

      // Generate the common type folder
      result.common = generateModuleBindings({
        name: "common",
        typeInfo: commonTypeInfo,
        schema: "N/A",
        outputDirAbs: options.commonDirAbs,
      });
    }
  }

  for (const module of options.modules) {
    result.modules.push(generateModuleBindings(module));
  }

  return result;
};

function generateModuleBindings(module: BindModuleOptions): BindModuleOutput {
  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
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
    schema: module.schema,
  };
  const namespace = module.typeInfo.importedModuleTypes?.[0].namespace;
  renderTemplate(
    "./templates/schema.mustache",
    schemaContext,
    `${namespace ? namespace + "_" : ""}schema.graphql`
  );

  return result;
}
