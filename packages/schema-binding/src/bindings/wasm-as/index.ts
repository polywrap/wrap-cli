
import { buildConfig } from "./parsing";
import { OutputDirectory, OutputEntry, Schema } from "../../";
import path from "path";
import { loadDirectory } from "../../utils/fs";
const Mustache = require("mustache");

export function generateBinding(schema: Schema): OutputDirectory {
  const entries: OutputEntry[] = [];
  const config = buildConfig(schema);

  // Generate custom type folders
  for (const type of config.types) {
    entries.push({
      type: "Directory",
      name: type.name,
      data: generateFiles('./custom-type', type)
    });
  }

  // Generate import folder
  if (config.imports.length > 0) {
    const importEntries: OutputEntry[] = [];

    for (const importEntry of config.imports) {
      const importTypes: OutputEntry[] = [];

      // Generate import type folders
      for (const importType of importEntry.types) {
        importTypes.push({
          type: "Directory",
          name: importType.name,
          data: generateFiles('./import/namespace/type', importType)
        });
      }

      // Add the root namespace folder, with all sub types
      importEntries.push({
        type: "Directory",
        name: importEntry.namespace,
        data: [
          ...generateFiles('./import/namespace', importEntry),
          ...importTypes
        ]
      });
    }

    entries.push({
      type: "Directory",
      name: "imports",
      data: importEntries
    });
  }

  return {
    entries
  };
}

function generateFiles(subpath: string, config: any): OutputEntry[] {
  const output: OutputEntry[] = [];
  const absolutePath = path.join(__dirname, subpath);
  const directory = loadDirectory(absolutePath);

  const processDirectory = (entries: OutputEntry[], output: OutputEntry[]) => {
    // Load all sub-templates
    const subTemplates: any = { };

    for (const file of entries) {
      if (file.type !== "File") {
        continue;
      }

      const name = path.parse(file.name).name;

      // sub-templates contain '_' in their file names
      if (name.indexOf('_') > -1) {
        subTemplates[name] = file.data;
      }
    }

    // Generate all files, recurse all directories
    for (const dirent of entries) {
      if (dirent.type === "File") {
        const name = path.parse(dirent.name).name;

        // file templates don't contain '_'
        if (name.indexOf('_') === -1) {
          output.push({
            type: "File",
            name: name.replace('-', '.'),
            data: Mustache.render(dirent.data, config, subTemplates)
          });
        }
      } else if (dirent.type === "Directory") {
        const subOutput: OutputEntry[] = [];

        processDirectory(dirent.data as OutputEntry[], subOutput);

        output.push({
          type: "Directory",
          name: dirent.name,
          data: subOutput
        });
      }
    }
  }

  processDirectory(directory.entries, output);

  return output;
}
