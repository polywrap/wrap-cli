import { BuildConfig } from "../Compiler";
import { SchemaComposer } from "../SchemaComposer";

import chalk from "chalk";
import fs from "fs";
import Mustache from "mustache";
import {
  OutputDirectory,
  OutputEntry,
  writeDirectory,
} from "@web3api/schema-bind";
import { TypeInfo, parseSchema } from "@web3api/schema-parse";

export const generateCode = async (
  templateFile: string,
  config: BuildConfig
): Promise<boolean> => {
  // Make sure that the output dir exists, if not create a new one
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir);
  }

  // Compose schema from manifest
  const schemaComposer = new SchemaComposer(config);
  const manifest = await schemaComposer.loadManifest();
  const composedSchema = await schemaComposer.composeSchemas(manifest);
  const typeInfo = parseSchema(composedSchema.combined!);

  // Check the template file if it has the proper run() method
  let run;
  if (templateFile.endsWith(".js")) {
    run = await import(templateFile);
    if (run && run.default && run.default.run) {
      run = run.default.run;
    } else {
      console.log(
        chalk.red(
          "The template file provided is wrong or doesn't have the 'run' method."
        )
      );
      return false;
    }
  } else {
    console.log(chalk.red("Only .js files are accepted."));
    return false;
  }

  const output: OutputDirectory = {
    entries: [],
  };
  run(output);

  console.log(output);

  output.entries = await Promise.all(
    output.entries.map((entry) => generateFile(entry, typeInfo))
  );

  writeDirectory(config.outputDir, output);
  return true;
};

const generateFile = async (
  entry: OutputEntry,
  typeInfo: TypeInfo
): Promise<OutputEntry> => {
  if (entry.type === "Directory") {
    entry.data = await Promise.all(
      entry.data.map((subEntry) => generateFile(subEntry, typeInfo))
    );
  } else if (entry.type === "Template") {
    const template = await import(entry.data);
    entry.data = Mustache.render(template, typeInfo);
  }

  return entry;
};
