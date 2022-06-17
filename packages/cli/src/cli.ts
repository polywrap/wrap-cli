/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Commands from "./commands";
import { Command } from "./commands/types";

import { executeMaybeAsyncFunction } from "@polywrap/core-js";
import { program } from "commander";

export const run = async (argv: string[]): Promise<void> => {
  for (const command of Object.values(Commands) as Command[]) {
    await executeMaybeAsyncFunction(command.setup, program);
  }

  program.parse(argv);
};
