import { Command as Program, Argument } from "commander";

export { Program, Argument };

export interface Command {
  setup: (program: Program) => void;
}
