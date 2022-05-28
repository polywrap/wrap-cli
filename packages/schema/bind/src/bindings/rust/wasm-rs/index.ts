import * as Functions from "./functions";
import * as Transforms from "./transforms";
import { GenerateBindingFn } from "../../";
import { renderTemplates, loadSubTemplates } from "../../utils/templates";
import { extractCommonTypeInfo } from "../../utils/typeInfo";
import {
  BindOptions,
  BindOutput,
  BindModuleOutput,
  BindModuleOptions,
} from "../../..";

import {
  TypeInfo,
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  hasImports,
  methodParentPointers,
} from "@web3api/schema-parse";
import { OutputEntry, readDirectorySync } from "@web3api/os-js";
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
    modules: [],
  };

  // If there's more than one module provided
  if (options.modules.length > 1 && options.commonDirAbs) {
    // Extract the common types
    const commonTypeInfo = extractCommonTypeInfo(
      options.modules,
      options.commonDirAbs
    );

    // Generate the common type folder
    result.common = generateModuleBinding({
      name: "common",
      typeInfo: commonTypeInfo,
      schema: "N/A",
      outputDirAbs: options.commonDirAbs,
    });

    if (result.common.output.entries.length) {
      // Modify the common type directory to be a rust crate
      const crateEntries: OutputEntry[] = [];
      const srcEntries = result.common.output.entries;

      crateEntries.push({
        name: "src",
        type: "Directory",
        data: srcEntries
      });
      crateEntries.push({
        name: "Cargo.toml",
        type: "File",
        data:
`[package]
name = "common"
version = "0.0.1"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
web3api-wasm-rs = { version = "0.0.1-prealpha.75" }
serde = { version = "1.0", features = ["derive"] }
`
      });

      result.common.output.entries = crateEntries;
    } else {
      result.common = undefined;
    }
  }

  // Generate each module folder
  for (const module of options.modules) {
    result.modules.push(generateModuleBinding(module));
  }

  return result;
};

function applyTransforms(typeInfo: TypeInfo): TypeInfo {
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
    typeInfo = transformTypeInfo(typeInfo, transform);
  }
  return typeInfo;
}

function generateModuleBinding(module: BindModuleOptions): BindModuleOutput {
  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
  };
  const output = result.output;
  const typeInfo = applyTransforms(module.typeInfo);

  // Generate object type folders
  for (const objectType of typeInfo.objectTypes) {
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

  // Generate imported folder
  const importEntries: OutputEntry[] = [];

  // Generate imported module type folders
  for (const importedModuleType of typeInfo.importedModuleTypes) {
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
  for (const importedEnumType of typeInfo.importedEnumTypes) {
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
  for (const importedObectType of typeInfo.importedObjectTypes) {
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

  if (importEntries.length > 0) {
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
      name: toLower(interfaceType.type),
      data: renderTemplates(
        templatePath("interface-type"),
        interfaceType,
        subTemplates
      ),
    });
  }

  // Generate module type folders
  for (const moduleType of typeInfo.moduleTypes) {
    output.entries.push({
      type: "Directory",
      name: toLower(moduleType.type),
      data: renderTemplates(
        templatePath("module-type"),
        moduleType,
        subTemplates
      ),
    });
  }

  // Generate enum type folders
  for (const enumType of typeInfo.enumTypes) {
    output.entries.push({
      type: "Directory",
      name: toLower(enumType.type),
      data: renderTemplates(templatePath("enum-type"), enumType, subTemplates),
    });
  }

  // Generate root entry file
  output.entries.push(
    ...renderTemplates(templatePath(""), typeInfo, subTemplates)
  );

  return result;
}
