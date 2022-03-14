/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Commands from "./commands";
import { Command } from "./commands/types";

import { program } from "commander";

export const run = async (argv: string[]): Promise<void> => {
  /*const cli = build("w3")
    .src(__dirname)
    .plugins(`${process.cwd()}/node_modules`, {
      matching: "w3-*",
      hidden: true,
    })
    .help()
    .create();*/

  for (const command of Object.values(Commands) as Command[]) {
    command.setup(program);
  }

  program.parse(argv);
};
