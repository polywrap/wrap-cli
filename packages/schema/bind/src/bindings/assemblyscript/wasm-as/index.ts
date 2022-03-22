import * as Functions from "./functions";
import { reservedWordsAS } from "./reservedWords";
import { GenerateBindingFn } from "../..";
import { OutputDirectory, OutputEntry, readDirectory } from "../../../";
import { fromReservedWord } from "../../../utils/templateFunctions";

import {
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  TypeInfo,
  ObjectDefinition,
} from "@web3api/schema-parse";
import path from "path";
import Mustache from "mustache";

export const generateBinding: GenerateBindingFn = (
  output: OutputDirectory,
  typeInfo: TypeInfo,
  _schema: string,
  _config: Record<string, unknown>
): void => {
  // Transform the TypeInfo to our liking
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }

  const templatesDir = path.join(__dirname, "./templates");
  const directory = readDirectory(templatesDir);
  const subTemplates = loadSubTemplates(directory.entries);

  // Generate object type folders
  for (const objectType of typeInfo.objectTypes) {
    output.entries.push({
      type: "Directory",
      name: objectType.type,
      data: generateFiles("./templates/object-type", objectType, subTemplates),
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
};

function generateFiles(
  subpath: string,
  config: unknown,
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
            {
              ...(config as Record<string, unknown>),
              handleKeywords: fromReservedWord(reservedWordsAS),
            },
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
