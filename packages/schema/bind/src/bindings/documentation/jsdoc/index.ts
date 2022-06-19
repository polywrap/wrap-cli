import { GenerateBindingFn } from "../..";
import { BindOptions, BindOutput } from "../../..";
import * as Functions from "./../functions";
import * as TypeScriptFunctions from "./../../typescript/functions";
import { sortMethodsInPlaceByName, sortObjectsInPlaceByType } from "../utils";

import {
  TypeInfo,
  transformTypeInfo,
  addFirstLast,
  toPrefixedGraphQLType,
  extendType,
  methodParentPointers,
  ImportedDefinition,
  ModuleDefinition,
} from "@polywrap/schema-parse";
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
  const typeInfo = applyTransforms(options.typeInfo);
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
    renderTemplate(
      "./templates/jsdoc-module.mustache",
      module,
      `${module.type.toLowerCase()}.js`
    );
  }

  // TODO: for imported modules, module.type contains the namespace. Should it?
  // generate imported modules
  for (const module of typeInfo.importedModuleTypes) {
    renderTemplate(
      "./templates/jsdoc-module.mustache",
      module,
      `${module.type}.js`
    );
  }

  // generate object types
  if (typeInfo.objectTypes.length > 0) {
    renderTemplate(
      "./templates/jsdoc-objects.mustache",
      typeInfo,
      "objects.js"
    );
  }

  // generated imported object types
  const importedObjects = sortByNamespace(typeInfo.importedObjectTypes);
  for (const [namespace, objectTypes] of Object.entries(importedObjects)) {
    if (objectTypes.length > 0) {
      const objectContext = {
        objectTypes,
        imported: { namespace },
      };
      renderTemplate(
        "./templates/jsdoc-objects.mustache",
        objectContext,
        `${namespace}_objects.js`
      );
    }
  }

  // generate enum types
  if (typeInfo.enumTypes.length > 0) {
    renderTemplate("./templates/jsdoc-enums.mustache", typeInfo, "enums.js");
  }

  // generate imported enum types
  const importedEnums = sortByNamespace(typeInfo.importedEnumTypes);
  for (const [namespace, enumTypes] of Object.entries(importedEnums)) {
    if (enumTypes.length > 0) {
      const enumContext = {
        enumTypes,
        imported: { namespace },
      };
      renderTemplate(
        "./templates/jsdoc-enums.mustache",
        enumContext,
        `${namespace}_enums.js`
      );
    }
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

function sortByNamespace<T extends ImportedDefinition>(
  definitions: Array<T>
): Record<string, Array<T>> {
  const result: Record<string, Array<T>> = {};
  for (const val of definitions) {
    if (!result[val.namespace]) {
      result[val.namespace] = new Array<T>();
    }
    result[val.namespace].push(val);
  }
  return result;
}
