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
import { sortByNamespace } from "../utils";

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

export const LOCAL_NAMESPACE = "Local";

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
      result.common = generateDocusaurusModuleBindings({
        name: "common",
        typeInfo: commonTypeInfo,
        schema: "N/A",
        outputDirAbs: options.commonDirAbs,
      });
    }
  }

  for (const module of options.modules) {
    result.modules.push(generateDocusaurusModuleBindings(module));
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

export function generateDocusaurusModuleBindings(
  module: BindModuleOptions,
  _typeInfo?: TypeInfo
): BindModuleOutput {
  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
  };
  const output = result.output;
  const typeInfo = _typeInfo ?? applyTransforms(module.typeInfo);

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

  // generate modules
  for (const module of typeInfo.moduleTypes) {
    const moduleContext = {
      ...module,
      namespace: LOCAL_NAMESPACE,
    };
    renderTemplate(
      "./templates/docusaurus-module.mustache",
      moduleContext,
      `${LOCAL_NAMESPACE}_${module.type.toLowerCase()}.md`
    );
  }

  // generate object types
  if (typeInfo.objectTypes.length > 0) {
    const objectContext = {
      objectTypes: typeInfo.objectTypes,
      namespace: LOCAL_NAMESPACE,
    };
    renderTemplate(
      "./templates/docusaurus-objects.mustache",
      objectContext,
      `${LOCAL_NAMESPACE}_objects.md`
    );
  }

  // generate enum types
  if (typeInfo.enumTypes.length > 0) {
    const enumContext = {
      enumTypes: typeInfo.enumTypes,
      namespace: LOCAL_NAMESPACE,
    };
    renderTemplate(
      "./templates/docusaurus-enums.mustache",
      enumContext,
      `${LOCAL_NAMESPACE}_enums.md`
    );
  }

  // TODO: for imported modules, module.type contains the namespace. Should it?
  // generate imported modules
  for (const module of typeInfo.importedModuleTypes) {
    const moduleType = module.type.split("_")[1];
    const moduleContext = {
      ...module,
      namespace: module.namespace,
      type: moduleType,
    };
    renderTemplate(
      "./templates/docusaurus-module.mustache",
      moduleContext,
      `${module.namespace}_${moduleType.toLowerCase()}.md`
    );
  }

  // generated imported object types
  const importedObjects = sortByNamespace(typeInfo.importedObjectTypes);
  for (const [namespace, objectTypes] of Object.entries(importedObjects)) {
    if (objectTypes.length > 0) {
      const objectContext = {
        objectTypes,
        namespace,
      };
      renderTemplate(
        "./templates/docusaurus-objects.mustache",
        objectContext,
        `${namespace}_objects.md`
      );
    }
  }

  // generate imported enum types
  const importedEnums = sortByNamespace(typeInfo.importedEnumTypes);
  for (const [namespace, enumTypes] of Object.entries(importedEnums)) {
    if (enumTypes.length > 0) {
      const enumContext = {
        enumTypes,
        namespace,
      };
      renderTemplate(
        "./templates/docusaurus-enums.mustache",
        enumContext,
        `${namespace}_enums.md`
      );
    }
  }

  return result;
}
