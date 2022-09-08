import { intlMsg } from "../intl";

import path from "path";
import fs from "fs";

export function parseWorkflowScriptPathOption(script: string): string {
  const absPath = path.resolve(script);
  if (!fs.existsSync(absPath)) {
    throw new Error(
      intlMsg.commands_run_error_noWorkflowScriptFound({ path: absPath })
    );
  }
  return absPath;
}

export function parseWorkflowOutputFilePathOption(outputFile: string): string {
  return path.resolve(outputFile);
}
