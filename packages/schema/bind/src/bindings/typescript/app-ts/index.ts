/* eslint-disable @typescript-eslint/naming-convention */
import * as Functions from "../functions";
import { GenerateBindingFn } from "../..";
import {
  BindOptions,
  BindOutput,
  BindModuleOptions,
  BindModuleOutput
} from "../../..";

import {
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  TypeInfo,
} from "@web3api/schema-parse";
import Mustache from "mustache";
import { readFileSync } from "fs";
import path from "path";

export { Functions };

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {

  const result: BindOutput = {
    modules: []
  };

  for (const module of options.modules) {
    result.modules.push(
      generateModuleBindings(module)
    );
  }

  return result;
};

function applyTransforms(typeInfo: TypeInfo): TypeInfo {
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }
  return typeInfo;
}

function generateModuleBindings(
  module: BindModuleOptions
): BindModuleOutput {

  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: []
    },
    outputDirAbs: module.outputDirAbs
  };
  const output = result.output;
  const schema = module.schema;
  const typeInfo = applyTransforms(module.typeInfo);

  const renderTemplate = (
    subPath: string,
    context: unknown,
    fileName?: string
  ) => {
    const absPath = path.join(__dirname, subPath);
    const template = readFileSync(absPath, { encoding: "utf-8" });
    fileName =
      fileName ||
      absPath
        .replace(path.dirname(absPath), "")
        .replace(".mustache", "")
        .replace("/", "")
        .replace("\\", "")
        .replace("-", ".");

    output.entries.push({
      type: "File",
      name: fileName,
      data: Mustache.render(template, context),
    });
  };

  const rootContext = {
    ...typeInfo,
    schema,
  };

  renderTemplate("./templates/index-ts.mustache", rootContext);
  renderTemplate("./templates/schema-ts.mustache", rootContext);
  renderTemplate("./templates/types-ts.mustache", rootContext);

  return result;
}
