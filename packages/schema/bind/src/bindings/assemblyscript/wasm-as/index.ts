import * as Functions from "./functions";
import { GenerateBindingFn } from "../..";
import { extractCommonTypeInfo } from "../../utils/typeInfo";
import { readDirectory } from "../../utils/fs";
import {
  BindOptions,
  BindOutput,
  BindModuleOutput,
  BindModuleOptions,
  OutputEntry
} from "../../..";

import {
  TypeInfo,
  ObjectDefinition,
  transformTypeInfo,
  addFirstLast,
  extendType,
  toPrefixedGraphQLType,
} from "@web3api/schema-parse";
import Mustache from "mustache";
import path from "path";

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {

  const result: BindOutput = {
    modules: []
  };

  // If there's more than one module provided
  if (options.modules.length > 1 && options.commonDirAbs) {
    // Extract the common types
    const commonTypeInfo = extractCommonTypeInfo(
      options.modules,
      options.commonDirAbs
    );

    // Generate the common type folder
    result.common = generateTypeInfoBinding({
      name: "common",
      typeInfo: commonTypeInfo,
      schema: "N/A",
      outputDirAbs: options.commonDirAbs,
    });
  }

  // Generate each module folder
  for (const module of options.modules) {
    result.modules.push(
      generateTypeInfoBinding(module)
    );
  }

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

const templatesDir = readDirectory(
  path.join(__dirname, "./templates")
);

function generateTypeInfoBinding(
  module: BindModuleOptions
): BindModuleOutput {

  const subTemplates = loadSubTemplates(templatesDir.entries);
  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: []
    }
  };
  const output = result.output;
  const typeInfo = applyTransforms(module.typeInfo);

  // Generate object type folders
  for (const objectType of typeInfo.objectTypes) {
    output.entries.push({
      type: "Directory",
      name: objectType.type,
      data: generateFiles(
        "./templates/object-type",
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
      data: generateFiles(
        "./templates/imported/module-type",
        importedModuleType,
        subTemplates
      ),
    });
  }

  // Generate imported enum type folders
  for (const importedEnumType of typeInfo.importedEnumTypes) {
    importEntries.push({
      type: "Directory",
      name: importedEnumType.type,
      data: generateFiles(
        "./templates/imported/enum-type",
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
      data: generateFiles(
        "./templates/imported/object-type",
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
        ...generateFiles("./templates/imported", typeInfo, subTemplates),
      ],
    });
  }

  // Generate interface type folders
  for (const interfaceType of typeInfo.interfaceTypes) {
    output.entries.push({
      type: "Directory",
      name: interfaceType.type,
      data: generateFiles(
        "./templates/interface-type",
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
      data: generateFiles("./templates/module-type", moduleType, subTemplates),
    });
  }

  // Generate enum type folders
  for (const enumType of typeInfo.enumTypes) {
    output.entries.push({
      type: "Directory",
      name: enumType.type,
      data: generateFiles("./templates/enum-type", enumType, subTemplates),
    });
  }

  // Generate env type folders
  const generateEnvTypeFolder = (def: ObjectDefinition | undefined) => {
    def &&
      output.entries.push({
        type: "Directory",
        name: def.type,
        data: generateFiles("./templates/object-type", def, subTemplates),
      });
  };
  generateEnvTypeFolder(typeInfo.envTypes.query.client);
  generateEnvTypeFolder(typeInfo.envTypes.query.sanitized);
  generateEnvTypeFolder(typeInfo.envTypes.mutation.client);
  generateEnvTypeFolder(typeInfo.envTypes.mutation.sanitized);

  // Generate root entry file
  output.entries.push(...generateFiles("./templates", typeInfo, subTemplates));

  return result;
}

function generateFiles(
  subpath: string,
  view: unknown,
  subTemplates: Record<string, string>,
  subDirectories = false
): OutputEntry[] {
  const output: OutputEntry[] = [];
  const absolutePath = path.join(__dirname, subpath);
  const directory = readDirectory(absolutePath);

  const processDirectory = (entries: OutputEntry[], output: OutputEntry[]) => {
    subTemplates = loadSubTemplates(entries, subTemplates);

    // Generate all files, recurse all directories
    for (const dirent of entries) {
      if (dirent.type === "File") {
        const name = path.parse(dirent.name).name;

        // file templates don't contain '_'
        if (name.indexOf("_") === -1) {
          const data = Mustache.render(
            dirent.data,
            view,
            subTemplates
          );

          // If the file isn't empty, add it to the output
          if (data) {
            output.push({
              type: "File",
              name: name.replace("-", "."),
              data,
            });
          }
        }
      } else if (dirent.type === "Directory" && subDirectories) {
        const subOutput: OutputEntry[] = [];

        processDirectory(dirent.data as OutputEntry[], subOutput);

        output.push({
          type: "Directory",
          name: dirent.name,
          data: subOutput,
        });
      }
    }
  };

  processDirectory(directory.entries, output);

  return output;
}

function loadSubTemplates(
  entries: OutputEntry[],
  existingSubTemplates?: Record<string, string>
): Record<string, string> {
  const subTemplates: Record<string, string> = existingSubTemplates
    ? existingSubTemplates
    : {};

  for (const file of entries) {
    if (file.type !== "File") {
      continue;
    }

    const name = path.parse(file.name).name;

    // sub-templates contain '_' in their file names
    if (name.indexOf("_") > -1) {
      subTemplates[name] = file.data as string;
    }
  }

  return subTemplates;
}
