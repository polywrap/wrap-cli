import * as Functions from "./functions";
import { GenerateBindingFn } from "../..";
import { extractCommonTypeInfo } from "../../utils/typeInfo";
import { renderTemplates, loadSubTemplates } from "../../utils/templates";
import {
  BindOptions,
  BindOutput,
  BindModuleOutput,
  BindModuleOptions,
} from "../../..";

import {
  TypeInfo,
  ObjectDefinition,
  transformTypeInfo,
  addFirstLast,
  extendType,
  toPrefixedGraphQLType,
  setMemberTypeParentUnionNames,
} from "@web3api/schema-parse";
import { OutputEntry, readDirectorySync } from "@web3api/os-js";
import path from "path";

const templatesDir = readDirectorySync(path.join(__dirname, "./templates"));
const subTemplates = loadSubTemplates(templatesDir.entries);
const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

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
    setMemberTypeParentUnionNames,
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

  // Generated imported union type folders
  for (const importedUnionType of typeInfo.importedUnionTypes) {
    importEntries.push({
      type: "Directory",
      name: importedUnionType.type,
      data: renderTemplates(
        templatePath("imported/union-type"),
        importedUnionType,
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
  for (const moduleType of typeInfo.moduleTypes) {
    output.entries.push({
      type: "Directory",
      name: moduleType.type,
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
      name: enumType.type,
      data: renderTemplates(templatePath("enum-type"), enumType, subTemplates),
    });
  }

  // Generate union type folders
  for (const unionType of typeInfo.unionTypes) {
    output.entries.push({
      type: "Directory",
      name: unionType.type,
      data: renderTemplates(templatePath("union-type"), unionType, subTemplates),
    });
  }
  // Generate env type folders
  const generateEnvTypeFolder = (def: ObjectDefinition | undefined) => {
    def &&
      output.entries.push({
        type: "Directory",
        name: def.type,
        data: renderTemplates(templatePath("object-type"), def, subTemplates),
      });
  };
  generateEnvTypeFolder(typeInfo.envTypes.query.client);
  generateEnvTypeFolder(typeInfo.envTypes.query.sanitized);
  generateEnvTypeFolder(typeInfo.envTypes.mutation.client);
  generateEnvTypeFolder(typeInfo.envTypes.mutation.sanitized);

  // Generate root entry file
  output.entries.push(
    ...renderTemplates(templatePath(""), typeInfo, subTemplates)
  );

  return result;
}
