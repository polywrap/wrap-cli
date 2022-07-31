import * as Functions from "./../functions";
import {
  arrangeByNamespace,
  sortMethodsInPlaceByName,
  sortObjectsInPlaceByType,
} from "../utils";

import {
  Abi,
  transformAbi,
  addFirstLast,
  toPrefixedGraphQLType,
  extendType,
  methodParentPointers,
} from "@polywrap/schema-parse";
import {
  BindOptions,
  BindOutput,
  GenerateBindingFn,
  TypeScript
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
    renderTemplate(
      "./templates/docusaurus-module.mustache",
      abi.moduleType,
      "module.md"
    );
  }

  // generate object types
  if (abi.objectTypes.length > 0) {
    const objectContext = {
      objectTypes: abi.objectTypes,
    };
    renderTemplate(
      "./templates/docusaurus-objects.mustache",
      objectContext,
      "objects.md"
    );
  }

  // generate enum types
  if (abi.enumTypes.length > 0) {
    const enumContext = {
      enumTypes: abi.enumTypes,
    };
    renderTemplate(
      "./templates/docusaurus-enums.mustache",
      enumContext,
      "enums.md"
    );
  }

  // generate env type
  if (abi.envType) {
    const envContext = {
      envType: abi.envType,
    };
    renderTemplate("./templates/docusaurus-env.mustache", envContext, "env.md");
  }

  // TODO: for imported modules, module.type contains the namespace. Should it?
  // generate imported modules
  for (const module of abi.importedModuleTypes) {
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
  const importedObjects = arrangeByNamespace(abi.importedObjectTypes);
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
  const importedEnums = arrangeByNamespace(abi.importedEnumTypes);
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

  // generate imported env types
  const importedEnvs = arrangeByNamespace(abi.importedEnvTypes);
  for (const [namespace, envType] of Object.entries(importedEnvs)) {
    if (envType) {
      const envContext = {
        envType,
        namespace,
      };
      renderTemplate(
        "./templates/docusaurus-env.mustache",
        envContext,
        `${namespace}_env.md`
      );
    }
  }

  return result;
};

function applyTransforms(abi: Abi): Abi {
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
