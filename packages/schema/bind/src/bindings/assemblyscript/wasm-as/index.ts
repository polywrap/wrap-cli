import * as Functions from "./functions";
import { GenerateBindingFn } from "../..";
import { renderTemplates, loadSubTemplates } from "../../utils/templates";
import { BindOptions, BindOutput } from "../../..";

import {
  TypeInfo,
  transformTypeInfo,
  addFirstLast,
  extendType,
  toPrefixedGraphQLType,
} from "@polywrap/schema-parse";
import { OutputEntry, readDirectorySync } from "@polywrap/os-js";
import path from "path";

const templatesDir = readDirectorySync(path.join(__dirname, "./templates"));
const subTemplates = loadSubTemplates(templatesDir.entries);
const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

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

  // Generate object type folders
  for (const objectType of typeInfo.objectTypes) {
    output.entries.push({
      type: "Directory",
      name: objectType.type,
      data: renderTemplates(
        templatePath("object-type"),
        objectType,
        subTemplates
      ),
    });
  }

  // Generate imported folder
  const importEntries: OutputEntry[] = [];

  // Generate imported module type folders
  for (const importedModuleType of typeInfo.importedModuleTypes) {
    importEntries.push({
      type: "Directory",
      name: importedModuleType.type,
      data: renderTemplates(
        templatePath("imported/module-type"),
        importedModuleType,
        subTemplates
      ),
    });
  }

  // Generate imported env type folders
  for (const importedEnvType of typeInfo.importedEnvTypes) {
    importEntries.push({
      type: "Directory",
      name: importedEnvType.type,
      data: renderTemplates(
        templatePath("imported/env-type"),
        importedEnvType,
        subTemplates
      ),
    });
  }

  // Generate imported enum type folders
  for (const importedEnumType of typeInfo.importedEnumTypes) {
    importEntries.push({
      type: "Directory",
      name: importedEnumType.type,
      data: renderTemplates(
        templatePath("imported/enum-type"),
        importedEnumType,
        subTemplates
      ),
    });
  }

  // Generate imported object type folders
  for (const importedObectType of typeInfo.importedObjectTypes) {
    importEntries.push({
      type: "Directory",
      name: importedObectType.type,
      data: renderTemplates(
        templatePath("imported/object-type"),
        importedObectType,
        subTemplates
      ),
    });
  }

  if (importEntries.length) {
    output.entries.push({
      type: "Directory",
      name: "imported",
      data: [
        ...importEntries,
        ...renderTemplates(templatePath("imported"), typeInfo, subTemplates),
      ],
    });
  }

  // Generate interface type folders
  for (const interfaceType of typeInfo.interfaceTypes) {
    output.entries.push({
      type: "Directory",
      name: interfaceType.type,
      data: renderTemplates(
        templatePath("interface-type"),
        interfaceType,
        subTemplates
      ),
    });
  }

  // Generate module type folders
  if (typeInfo.moduleType) {
    output.entries.push({
      type: "Directory",
      name: typeInfo.moduleType.type,
      data: renderTemplates(
        templatePath("module-type"),
        typeInfo.moduleType,
        subTemplates
      ),
    });
  }

  // Generate enum type folders
  for (const enumType of typeInfo.enumTypes) {
    output.entries.push({
      type: "Directory",
      name: enumType.type,
      data: renderTemplates(templatePath("enum-type"), enumType, subTemplates),
    });
  }

  // Generate env type folders
  if (typeInfo.envType) {
    output.entries.push({
      type: "Directory",
      name: typeInfo.envType.type,
      data: renderTemplates(
        templatePath("env-type"),
        typeInfo.envType,
        subTemplates
      ),
    });
  }

  // Generate root entry file
  output.entries.push(
    ...renderTemplates(templatePath(""), typeInfo, subTemplates)
  );

  return result;
};

function applyTransforms(typeInfo: TypeInfo): TypeInfo {
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }
  return typeInfo;
}
