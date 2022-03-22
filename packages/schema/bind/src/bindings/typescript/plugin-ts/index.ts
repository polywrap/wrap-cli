/* eslint-disable @typescript-eslint/naming-convention */
import * as Functions from "../functions";
import { GenerateBindingFn } from "../..";
import { renderTemplates, loadSubTemplates } from "../../utils/templates";
import {
  BindOptions,
  BindOutput,
  BindModuleOptions,
  BindModuleOutput,
} from "../../..";

import {
  TypeInfo,
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  interfaceUris,
} from "@web3api/schema-parse";
import { readDirectorySync } from "@web3api/os-js";
import path from "path";

export { Functions };

const templatesDir = readDirectorySync(path.join(__dirname, "./templates"));
const subTemplates = loadSubTemplates(templatesDir.entries);
const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const result: BindOutput = {
    modules: [],
  };

  // If there's a common directory
  if (options.commonDirAbs) {
    // Generate root entry point files
    result.common = {
      name: "common",
      output: {
        entries: renderTemplates(
          templatePath(""),
          options,
          subTemplates
        ),
      },
      outputDirAbs: options.commonDirAbs,
    };
  }

  // Generate types for each module
  for (const module of options.modules) {
    result.modules.push(generateModuleBindings(module));
  }

  return result;
};

function applyTransforms(typeInfo: TypeInfo): TypeInfo {
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
    interfaceUris(),
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }
  return typeInfo;
}

function generateModuleBindings(module: BindModuleOptions): BindModuleOutput {
  const result: BindModuleOutput = {
    name: Functions.toClassName()(module.name, (x) => x),
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
  };
  module.typeInfo = applyTransforms(module.typeInfo);

  result.output.entries = renderTemplates(
    templatePath("module-type"),
    module,
    subTemplates
  );

  return result;
}
