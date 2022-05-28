import { Command as Program } from "commander";

export { Program };

export interface Command {
  setup: (program: Program) => void;
}
