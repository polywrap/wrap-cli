import * as Functions from "../functions";
import {
  arrangeByNamespace,
  sortMethodsInPlaceByName,
  sortObjectsInPlaceByType,
} from "../utils";

import {
  transformAbi,
  addFirstLast,
  toPrefixedGraphQLType,
  extendType,
  methodParentPointers,
  ImportedDefinition,
  ModuleDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";
import {
  BindOptions,
  BindOutput,
  GenerateBindingFn,
  TypeScript,
} from "@polywrap/schema-bind";
import Mustache from "mustache";
import path from "path";
import { readFileSync } from "fs";

export const scriptPath = path.join(__dirname, "index.js");

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
  const abi = applyTransforms(options.abi);
  sortObjectsInPlaceByType(abi);
  sortMethodsInPlaceByName(abi);

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
  if (abi.moduleType) {
    const module: ModuleDefinition = abi.moduleType;
    renderTemplate(
      "./templates/jsdoc-module.mustache",
      module,
      `${module.type.toLowerCase()}.js`
    );
  }

  // generate object types
  if (abi.objectTypes && abi.objectTypes.length > 0) {
    renderTemplate("./templates/jsdoc-objects.mustache", abi, "objects.js");
  }

  // generate enum types
  if (abi.enumTypes && abi.enumTypes.length > 0) {
    renderTemplate("./templates/jsdoc-enums.mustache", abi, "enums.js");
  }

  // generate env type
  if (abi.envType) {
    const envContext = {
      envType: abi.envType,
    };
    renderTemplate("./templates/jsdoc-env.mustache", envContext, "env.js");
  }

  // TODO: for imported modules, module.type contains the namespace. Should it?
  // generate imported modules
  if (abi.importedModuleTypes) {
    for (const module of abi.importedModuleTypes) {
      renderTemplate(
        "./templates/jsdoc-module.mustache",
        module,
        `${module.type}.js`
      );
    }
  }

  // generated imported object types
  if (abi.importedObjectTypes) {
    const importedObjects = sortByNamespace(abi.importedObjectTypes);
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
  }

  // generate imported enum types
  if (abi.importedEnumTypes) {
    const importedEnums = sortByNamespace(abi.importedEnumTypes);
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
  }

  // generate imported env types
  if (abi.importedEnvTypes) {
    const importedEnvs = arrangeByNamespace(abi.importedEnvTypes);
    for (const [namespace, envType] of Object.entries(importedEnvs)) {
      if (envType) {
        const envContext = {
          envType,
          namespace,
        };
        renderTemplate(
          "./templates/jsdoc-env.mustache",
          envContext,
          `${namespace}_env.js`
        );
      }
    }
  }

  return result;
};

function applyTransforms(abi: WrapAbi): WrapAbi {
  const transforms = [
    extendType(Functions),
    extendType(TypeScript.Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
  ];

  for (const transform of transforms) {
    abi = transformAbi(abi, transform);
  }
  return abi;
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
