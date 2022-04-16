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

import {
  TypeInfo,
  transformTypeInfo,
  addFirstLast,
  toPrefixedGraphQLType,
  extendType,
  methodParentPointers,
  ImportedDefinition,
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
  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
  };
  const output = result.output;
  const typeInfo = applyTransforms(module.typeInfo);

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
    renderTemplate(
      "./templates/docusaurus-module.mustache",
      module,
      `${module.type.toLowerCase()}.md`
    );
  }

  // TODO: for imported modules, module.type contains the namespace. Should it?
  // generate imported modules
  for (const module of typeInfo.importedModuleTypes) {
    renderTemplate(
      "./templates/docusaurus-module.mustache",
      module,
      `${module.type}.md`
    );
  }

  // generate object types
  if (typeInfo.objectTypes.length > 0) {
    renderTemplate(
      "./templates/docusaurus-objects.mustache",
      typeInfo,
      "objects.md"
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
        "./templates/docusaurus-objects.mustache",
        objectContext,
        `${namespace}_objects.md`
      );
    }
  }

  // generate enum types
  if (typeInfo.enumTypes.length > 0) {
    renderTemplate(
      "./templates/docusaurus-enums.mustache",
      typeInfo,
      "enums.md"
    );
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
        "./templates/docusaurus-enums.mustache",
        enumContext,
        `${namespace}_enums.md`
      );
    }
  }

  return result;
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
