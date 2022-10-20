import { MaybeAsync } from "@polywrap/core-js";
import { Command as Program, Argument } from "commander";

export { Program, Argument };

export interface Command {
  setup: (program: Program) => MaybeAsync<void>;
}

export interface BaseCommandOptions {
  verbose?: boolean;
  quiet?: boolean;
}

export type CommandOptionMapping = {
  [name: string]: BaseCommandOptions | CommandOptionMapping;
}
