import { intlMsg } from "../intl";
import { JobStatus, ValidationResult, WorkflowOutput } from "./types";

import path from "path";
import fs from "fs";

export function loadValidationScript(
  manifestPath: string,
  cueFilepath: string
): string {
  cueFilepath = path.join(path.dirname(manifestPath), cueFilepath);

  if (!fs.existsSync(cueFilepath)) {
    console.error(
      intlMsg.commands_run_error_validatorNotFound({
        path: cueFilepath,
      })
    );
    process.exit(1);
  }

  return cueFilepath;
}

export function printJobOutput(
  output: WorkflowOutput,
  validation?: ValidationResult
): void {
  console.log("-----------------------------------");

  console.log(`ID: ${output.id}`);
  console.log(`Status: ${output.status}`);

  if (output.data !== undefined) {
    console.log(`Data: ${JSON.stringify(output.data, null, 2)}`);
  }

  if (output.error) {
    console.log(`Validation: ${JobStatus.SKIPPED}`);
    console.log(`Error: ${output.error.message}`);
  } else if (validation) {
    console.log(`Validation: ${validation.status}`);
    if (validation.stderr !== undefined) {
      const msgLines = validation.stderr.split(/\r?\n/);
      msgLines[1] = `${msgLines[1].split(":").slice(1).join(":")}`;
      const errMsg = msgLines.slice(0, 2).join("\n");
      console.log(`Error: ${errMsg}`);
    }
  }

  console.log("-----------------------------------");
}
