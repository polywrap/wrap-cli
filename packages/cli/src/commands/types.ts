import { MaybeAsync } from "@polywrap/core-js";
import { Command as Program, Argument } from "commander";

export { Program, Argument };

export interface Command {
  setup: (program: Program) => MaybeAsync<void>;
}

type SerializableOption = string | number | boolean;

export interface BaseCommandOptions {
  verbose: boolean;
  quiet: boolean;
  [prop: string]: SerializableOption | SerializableOption[];
}

export interface CommandTypes {
  options: BaseCommandOptions;
  arguments: string[];
}

export type CommandTypeMapping = {
  [name: string]: BaseCommandOptions | CommandTypes | CommandTypeMapping;
}
