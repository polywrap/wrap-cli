import { Functions } from "../";
import { GenerateBindingFn } from "../..";
import { renderTemplates } from "../..";
import { loadSubTemplates } from "../../utils";
import { BindOptions, BindOutput } from "../../..";

import {
  Abi,
  transformAbi,
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

function camel2snake(str: string): string {
  str = str.replace(/([A-Z])/g, "_$1");
  str = str.startsWith("_") ? str.slice(1) : str;
  return str.toLowerCase();
}

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
  if (abi.objectTypes) {
    for (const objectType of abi.objectTypes) {
      output.entries.push({
        type: "Directory",
        name: "types",
        data: renderTemplates(
          templatePath("object-type"),
          objectType,
          subTemplates
        ),
      });
    }
  }

  // Generate imported folder
  const importEntries: OutputEntry[] = [];

  // Generate imported module type folders
  if (abi.importedModuleTypes) {
    for (const importedModuleType of abi.importedModuleTypes) {
      importEntries.push({
        type: "Directory",
        name: `${camel2snake(importedModuleType.namespace)}`,
        data: renderTemplates(
          templatePath("imported/module-type"),
          importedModuleType,
          subTemplates
        ),
      });
    }
  }

  // // Generate imported env type folders
  if (abi.importedEnvTypes) {
    for (const importedEnvType of abi.importedEnvTypes) {
      importEntries.push({
        type: "Directory",
        name: `${camel2snake(importedEnvType.namespace)}`,
        data: renderTemplates(
          templatePath("imported/env-type"),
          importedEnvType,
          subTemplates
        ),
      });
    }
  }

  // Generate imported enum type folders
  if (abi.importedEnumTypes) {
    for (const importedEnumType of abi.importedEnumTypes) {
      importEntries.push({
        type: "Directory",
        name: `${camel2snake(importedEnumType.namespace)}`,
        data: renderTemplates(
          templatePath("imported/enum-type"),
          importedEnumType,
          subTemplates
        ),
      });
    }
  }

  // Generate imported object type folders
  if (abi.importedObjectTypes) {
    for (const importedObectType of abi.importedObjectTypes) {
      importEntries.push({
        type: "Directory",
        name: `${camel2snake(importedObectType.namespace)}`,
        data: renderTemplates(
          templatePath("imported/object-type"),
          importedObectType,
          subTemplates
        ),
      });
    }
  }

  if (importEntries.length) {
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
  if (abi.interfaceTypes) {
    for (const interfaceType of abi.interfaceTypes) {
      output.entries.push({
        type: "Directory",
        name: "interfaces",
        data: renderTemplates(
          templatePath("interface-type"),
          interfaceType,
          subTemplates
        ),
      });
    }
  }

  // Generate module type folders
  if (abi.moduleType) {
    output.entries.push({
      type: "Directory",
      name: "types",
      data: renderTemplates(
        templatePath("module-type"),
        abi.moduleType,
        subTemplates
      ),
    });
  }

  // Generate enum type folders
  if (abi.enumTypes) {
    for (const enumType of abi.enumTypes) {
      output.entries.push({
        type: "Directory",
        name: "types",
        data: renderTemplates(
          templatePath("enum-type"),
          enumType,
          subTemplates
        ),
      });
    }
  }

  // Generate env type folders
  if (abi.envType) {
    output.entries.push({
      type: "Directory",
      name: "types",
      data: renderTemplates(
        templatePath("object-type"),
        abi.envType,
        subTemplates
      ),
    });
  }

  // Generate root entry file
  output.entries.push(...renderTemplates(templatePath(""), abi, subTemplates));
  output.entries = mergePaths(output.entries);

  return result;
};

function mergePaths(array: OutputEntry[]): OutputEntry[] {
  const tmp: { [key: string]: OutputEntry } = {};
  for (let i = 0; i < array.length; i++) {
    switch (array[i].type) {
      case "File":
        tmp[array[i].name] = array[i];
        break;
      case "Directory":
        if (!tmp[array[i].name]) {
          tmp[array[i].name] = array[i];
        } else {
          (tmp[array[i].name].data as OutputEntry[]).push(
            ...(array[i].data as OutputEntry[])
          );
        }
        break;
    }
  }
  array = Object.values(tmp);
  for (let i = 0; i < array.length; i++) {
    if (array[i].type === "Directory") {
      array[i].data = mergePaths(array[i].data as OutputEntry[]);
    }
  }
  return array;
}

function applyTransforms(abi: Abi): Abi {
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
  ];

  for (const transform of transforms) {
    abi = transformAbi(abi, transform);
  }
  return abi;
}
