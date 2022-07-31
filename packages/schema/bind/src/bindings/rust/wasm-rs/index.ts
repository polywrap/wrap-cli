import * as Functions from "./functions";
import * as Transforms from "./transforms";
import { GenerateBindingFn } from "../../";
import { renderTemplates, loadSubTemplates } from "../../utils/templates";
import { BindOptions, BindOutput } from "../../..";

import {
  Abi,
  transformAbi,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  hasImports,
  methodParentPointers,
} from "@polywrap/schema-parse";
import { OutputEntry, readDirectorySync } from "@polywrap/os-js";
import path from "path";

const templatesDir = readDirectorySync(path.join(__dirname, "./templates"));
const subTemplates = loadSubTemplates(templatesDir.entries);
const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

const toLower = (type: string) => Functions.toLower()(type, (str) => str);

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

  // Generate object type folders
  for (const objectType of abi.objectTypes) {
    output.entries.push({
      type: "Directory",
      name: toLower(objectType.type),
      data: renderTemplates(
        templatePath("object-type"),
        objectType,
        subTemplates
      ),
    });
  }

  // Generate env type folders
  if (abi.envType) {
    output.entries.push({
      type: "Directory",
      name: toLower(abi.envType.type),
      data: renderTemplates(
        templatePath("env-type"),
        abi.envType,
        subTemplates
      ),
    });
  }

  // Generate imported folder
  const importEntries: OutputEntry[] = [];

  // Generate imported module type folders
  for (const importedModuleType of abi.importedModuleTypes) {
    importEntries.push({
      type: "Directory",
      name: toLower(importedModuleType.type),
      data: renderTemplates(
        templatePath("imported/module-type"),
        importedModuleType,
        subTemplates
      ),
    });
  }

  // Generate imported enum type folders
  for (const importedEnumType of abi.importedEnumTypes) {
    importEntries.push({
      type: "Directory",
      name: toLower(importedEnumType.type),
      data: renderTemplates(
        templatePath("imported/enum-type"),
        importedEnumType,
        subTemplates
      ),
    });
  }

  // Generate imported object type folders
  for (const importedObectType of abi.importedObjectTypes) {
    importEntries.push({
      type: "Directory",
      name: toLower(importedObectType.type),
      data: renderTemplates(
        templatePath("imported/object-type"),
        importedObectType,
        subTemplates
      ),
    });
  }

  // Generate imported env type folders
  for (const importedEnvType of abi.importedEnvTypes) {
    importEntries.push({
      type: "Directory",
      name: toLower(importedEnvType.type),
      data: renderTemplates(
        templatePath("imported/env-type"),
        importedEnvType,
        subTemplates
      ),
    });
  }

  if (importEntries.length > 0) {
    output.entries.push({
      type: "Directory",
      name: "imported",
      data: [
        ...importEntries,
        ...renderTemplates(templatePath("imported"), abi, subTemplates),
      ],
    });
  }

  // Generate interface type folders
  for (const interfaceType of abi.interfaceTypes) {
    output.entries.push({
      type: "Directory",
      name: toLower(interfaceType.type),
      data: renderTemplates(
        templatePath("interface-type"),
        interfaceType,
        subTemplates
      ),
    });
  }

  // Generate module type folders
  if (abi.moduleType) {
    output.entries.push({
      type: "Directory",
      name: toLower(abi.moduleType.type),
      data: renderTemplates(templatePath("module-type"), abi, subTemplates),
    });
  }

  // Generate enum type folders
  for (const enumType of abi.enumTypes) {
    output.entries.push({
      type: "Directory",
      name: toLower(enumType.type),
      data: renderTemplates(templatePath("enum-type"), enumType, subTemplates),
    });
  }

  // Generate root entry file
  output.entries.push(...renderTemplates(templatePath(""), abi, subTemplates));

  return result;
};

function applyTransforms(abi: Abi): Abi {
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    hasImports,
    methodParentPointers(),
    Transforms.propertyDeps(),
    Transforms.byRef(),
  ];

  for (const transform of transforms) {
    abi = transformAbi(abi, transform);
  }
  return abi;
}
