import { Command, Program } from "./types";

export const manifest: Command = {
  setup: (program: Program) => {
    const manifestCommand = program
      .command("manifest")
      .alias("m")
      .description("Manifest commands");

    manifestCommand
      .command("schema")
      .description("Prints out the schema for the current manifest format.")
      .action(async (options) => {
        await runSchemaCommand(options);
      });
  },
};

type ManifestSchemaCommandOptions = {};

const runSchemaCommand = async (_options: ManifestSchemaCommandOptions) => {
  console.log("bepis");
};
