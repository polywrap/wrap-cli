import { intlMsg } from "../intl";

import path from "path";
import fs from "fs";

export function parseWorkflowScriptPathOption(
  script: string
): string {
  const absPath = path.resolve(script);
  if (!fs.existsSync(absPath)) {
    throw new Error(
      intlMsg.commands_run_error_noWorkflowScriptFound({ path: absPath })
    );
  }
  return absPath;
}

export function parseWorkflowOutputFilePathOption(
  outputFile: string
): string {
  return path.resolve(outputFile);
}

export function parseValidateScriptOption(cueFile: string): string {
  const cueFilepath = path.resolve(cueFile);

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
