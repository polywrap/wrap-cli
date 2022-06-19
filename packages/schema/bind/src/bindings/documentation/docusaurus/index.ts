import { GenerateBindingFn } from "../..";
import { BindOptions, BindOutput } from "../../..";
import * as Functions from "./../functions";
import * as TypeScriptFunctions from "./../../typescript/functions";
import {
  arrangeByNamespace,
  sortMethodsInPlaceByName,
  sortObjectsInPlaceByType,
} from "../utils";

import {
  TypeInfo,
  transformTypeInfo,
  addFirstLast,
  toPrefixedGraphQLType,
  extendType,
  methodParentPointers,
  ModuleDefinition,
} from "@polywrap/schema-parse";
import Mustache from "mustache";
import path from "path";
import { readFileSync } from "fs";

export const LOCAL_NAMESPACE = "Local";

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  return generateDocusaurusBindings(options);
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

export function generateDocusaurusBindings(
  options: BindOptions,
  _typeInfo?: TypeInfo
): BindOutput {
  const result: BindOutput = {
    output: {
      entries: [],
    },
    outputDirAbs: options.outputDirAbs,
  };
  const output = result.output;
  const typeInfo = _typeInfo ?? applyTransforms(options.typeInfo);
  sortObjectsInPlaceByType(typeInfo);
  sortMethodsInPlaceByName(typeInfo);

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
  if (typeInfo.moduleType) {
    const module: ModuleDefinition = typeInfo.moduleType;
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
  const importedObjects = arrangeByNamespace(typeInfo.importedObjectTypes);
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
  const importedEnums = arrangeByNamespace(typeInfo.importedEnumTypes);
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
