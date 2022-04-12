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
  TypeInfo,
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  interfaceUris,
  combineTypeInfo,
} from "@web3api/schema-parse";
import { renderSchema } from "@web3api/schema-compose";
import path from "path";

export { Functions };

const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const result: BindOutput = {
    modules: [],
  };

  // Require a common directory
  if (!options.commonDirAbs) {
    throw new Error("plugin-ts schema binding requires a common directory.");
  }

  // Aggregate the schemas (will be removed once user-defined modules are supported)
  const schema = renderSchema(
    combineTypeInfo(
      options.modules.map((m) => m.typeInfo)
    ), true
  );

  // Apply TypeInfo transforms
  options.modules = options.modules.map(
    (m) => ({ ...m, typeInfo: applyTransforms(m.typeInfo) })
  );

  // Generate root entry point files
  result.common = {
    name: "common",
    output: {
      entries: renderTemplates(
        templatePath(""),
        {
          ...options,
          ...Functions,
          schema
        },
        { }
      ),
    },
    outputDirAbs: options.commonDirAbs,
  };

  // Generate each module
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
    name: module.name,
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
  };
  const output = result.output;

  output.entries = renderTemplates(
    templatePath("module-type"),
    module.typeInfo,
    { }
  );

  return result;
}
