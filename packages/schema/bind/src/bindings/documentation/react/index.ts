import { GenerateBindingFn } from "../..";
import { extractCommonTypeInfo } from "../../utils/typeInfo";
import {
  BindOptions,
  BindOutput,
  BindModuleOutput,
  BindModuleOptions,
} from "../../..";
import * as Functions from "./../functions";
import * as TypeScriptFunctions from "./../../typescript/functions";
import { createNamespaceSections } from "./namespaceSections";
import { generateDocusaurusModuleBindings } from "../docusaurus";

import {
  TypeInfo,
  transformTypeInfo,
  addFirstLast,
  toPrefixedGraphQLType,
  extendType,
  methodParentPointers,
} from "@web3api/schema-parse";
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

function applyTransforms(typeInfo: TypeInfo): TypeInfo {
  const transforms = [
    extendType(Functions),
    extendType(TypeScriptFunctions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }
  return typeInfo;
}

function generateModuleBindings(module: BindModuleOptions): BindModuleOutput {
  const typeInfo = applyTransforms(module.typeInfo);
  const result: BindModuleOutput = generateDocusaurusModuleBindings(
    module,
    typeInfo
  );
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

  // generate sidebar.js
  const sidebarContext = createNamespaceSections(typeInfo);
  renderTemplate(
    "./templates/sidebars-js.mustache",
    sidebarContext,
    `../../sidebars.js`
  );

  return result;
}
