/* eslint-disable @typescript-eslint/naming-convention */
import * as Functions from "../functions";
import { GenerateBindingFn } from "../..";
import { renderTemplates } from "../../utils/templates";
import {
  BindOptions,
  BindOutput,
  BindModuleOptions,
  BindModuleOutput,
} from "../../..";

import {
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  TypeInfo,
} from "@web3api/schema-parse";
import path from "path";

export { Functions };

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const result: BindOutput = {
    modules: [],
  };

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
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }
  return typeInfo;
}

function generateModuleBindings(module: BindModuleOptions): BindModuleOutput {
  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
  };
  const output = result.output;
  const schema = module.schema;
  const typeInfo = applyTransforms(module.typeInfo);

  output.entries = renderTemplates(
    path.join(__dirname, "./templates"),
    { ...typeInfo, schema },
    {}
  );

  return result;
}
