import { OutputDirectory, OutputEntry } from "../../";
import { readDirectory } from "../../utils/fs";
import * as Functions from "./functions";

import {
  parseSchema,
  extendType,
  addFirstLast,
  toGraphQLType,
} from "@web3api/schema-parse";
import path from "path";
import Mustache from "mustache";

export function generateBinding(schema: string): OutputDirectory {
  const entries: OutputEntry[] = [];
  const typeInfo = parseSchema(schema, {
    transforms: [extendType(Functions), addFirstLast, toGraphQLType],
  });

  // Generate object type folders
  for (const objectType of typeInfo.objectTypes) {
    entries.push({
      type: "Directory",
      name: objectType.type,
      data: generateFiles("./templates/object-type", objectType),
    });
  }

  // Generate imported folder
  if (
    typeInfo.importedQueryTypes.length > 0 ||
    typeInfo.importedObjectTypes.length > 0
  ) {
    const importEntries: OutputEntry[] = [];

    // Generate imported query type folders
    for (const importedQueryType of typeInfo.importedQueryTypes) {
      importEntries.push({
        type: "Directory",
        name: importedQueryType.type,
        data: generateFiles(
          "./templates/imported/query-type",
          importedQueryType
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
          importedObectType
        ),
      });
    }

    entries.push({
      type: "Directory",
      name: "imported",
      data: [
        ...importEntries,
        ...generateFiles("./templates/imported", typeInfo),
      ],
    });
  }

  // Generate query type folders
  for (const queryType of typeInfo.queryTypes) {
    entries.push({
      type: "Directory",
      name: queryType.type,
      data: generateFiles("./templates/query-type", queryType),
    });
  }

  // Generate root entry file
  entries.push(...generateFiles("./templates", typeInfo));

  return {
    entries,
  };
}

function generateFiles(
  subpath: string,
  config: unknown,
  subDirectories = false
): OutputEntry[] {
  const output: OutputEntry[] = [];
  const absolutePath = path.join(__dirname, subpath);
  const directory = readDirectory(absolutePath);

  const processDirectory = (entries: OutputEntry[], output: OutputEntry[]) => {
    // Load all sub-templates
    const subTemplates: Record<string, string> = {};

    for (const file of entries) {
      if (file.type !== "File") {
        continue;
      }

      const name = path.parse(file.name).name;

      // sub-templates contain '_' in their file names
      if (name.indexOf("_") > -1) {
        subTemplates[name] = file.data;
      }
    }

    // Generate all files, recurse all directories
    for (const dirent of entries) {
      if (dirent.type === "File") {
        const name = path.parse(dirent.name).name;

        // file templates don't contain '_'
        if (name.indexOf("_") === -1) {
          output.push({
            type: "File",
            name: name.replace("-", "."),
            data: Mustache.render(dirent.data, config, subTemplates),
          });
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
