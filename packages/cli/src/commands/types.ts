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

export interface CommandTypes {
  options: BaseCommandOptions;
  arguments: string[];
}

export type CommandTypeMapping = {
  [name: string]: BaseCommandOptions | CommandTypes | CommandTypeMapping;
}
