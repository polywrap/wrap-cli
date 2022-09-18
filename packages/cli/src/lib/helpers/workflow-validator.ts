import { runCommandSync } from "../system";
import { intlMsg } from "../intl";

import path from "path";
import fs from "fs";
import os from "os";
import { InvokeResult } from "@polywrap/core-js";

const TMPDIR = fs.mkdtempSync(path.join(os.tmpdir(), `polywrap-cli`));

export function cueExists(): boolean {
  const { stdout } = runCommandSync("cue version", true);
  return stdout ? stdout.startsWith("cue version ") : false;
}

export function validateOutput(
  id: string,
  result: InvokeResult,
  validateScriptPath: string,
  quiet?: boolean
): void {
  if (!cueExists()) {
    console.warn(intlMsg.commands_run_error_cueDoesNotExist());
  }

  const index = id.lastIndexOf(".");
  const jobId = id.substring(0, index);
  const stepId = id.substring(index + 1);

  const selector = `${jobId}.\\$${stepId}`;
  const jsonOutput = `${TMPDIR}/${id}.json`;

  fs.writeFileSync(jsonOutput, JSON.stringify(result, null, 2));

  const { stderr } = runCommandSync(
    `cue vet -d ${selector} ${validateScriptPath} ${jsonOutput}`,
    true
  );
  if (!stderr) {
    if (!quiet) {
      console.log("Validation: SUCCEED");
    }
  } else {
    const msgLines = stderr.stderr.split(/\r?\n/);
    msgLines[1] = `${validateScriptPath}:${msgLines[1]
      .split(":")
      .slice(1)
      .join(":")}`;
    const errMsg = msgLines.slice(0, 2).join("\n");

    if (!quiet) {
      console.log("Validation: FAILED");
      console.log(`Error: ${errMsg}`);
    }
    process.exitCode = 1;
  }

  if (fs.existsSync(jsonOutput)) {
    fs.unlinkSync(jsonOutput);
  }
}
