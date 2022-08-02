import { runCommand } from "../system";
import { intlMsg } from "../intl";

import path from "path";
import fs from "fs";
import os from "os";
import { InvokeResult } from "@polywrap/core-js";

const TMPDIR = fs.mkdtempSync(path.join(os.tmpdir(), `polywrap-cli`));

export async function cueExists(): Promise<boolean> {
  try {
    const { stdout } = await runCommand("cue version", true);
    return stdout.startsWith("cue version ");
  } catch (e) {
    return false;
  }
}

export async function validateOutput(
  id: string,
  result: InvokeResult,
  validateScriptPath: string,
  quiet?: boolean
): Promise<void> {
  if (!(await cueExists())) {
    console.warn(intlMsg.commands_run_error_cueDoesNotExist());
  }

  const index = id.lastIndexOf(".");
  const jobId = id.substring(0, index);
  const stepId = id.substring(index + 1);

  const selector = `${jobId}.\\$${stepId}`;
  const jsonOutput = `${TMPDIR}/${id}.json`;

  await fs.promises.writeFile(jsonOutput, JSON.stringify(result, null, 2));

  try {
    await runCommand(
      `cue vet -d ${selector} ${validateScriptPath} ${jsonOutput}`,
      true
    );
    if (!quiet) {
      console.log("Validation: SUCCEED");
    }
  } catch (e) {
    const msgLines = e.stderr.split(/\r?\n/);
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
    await fs.promises.unlink(jsonOutput);
  }
}
