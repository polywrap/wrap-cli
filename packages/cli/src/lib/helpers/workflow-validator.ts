import { runCommandSync } from "../system";
import { Logger } from "../logging";
import { intlMsg } from "../intl";
import { Status, WorkflowOutput } from "../workflow";

import path from "path";
import fs from "fs";
import os from "os";

const TMPDIR = fs.mkdtempSync(path.join(os.tmpdir(), `polywrap-cli`));

export function cueExists(logger: Logger): boolean {
  const { stdout } = runCommandSync("cue version", logger);
  return stdout ? stdout.startsWith("cue version ") : false;
}

export const typesHandler = (_: unknown, value: unknown): unknown => {
  if (value instanceof Map) {
    return Array.from(value).reduce(
      (obj: Record<string, unknown>, [key, value]) => {
        obj[key] = value;
        return obj;
      },
      {}
    );
  }

  return value;
};

export function validateOutput(
  output: WorkflowOutput,
  validateScriptPath: string,
  logger: Logger
): void {
  if (!cueExists(logger)) {
    console.warn(intlMsg.commands_test_error_cueDoesNotExist());
  }

  const { id, data, error } = output;

  const index = id.lastIndexOf(".");
  const jobId = id.substring(0, index);
  const stepId = id.substring(index + 1);

  const selector = `${jobId}.\\$${stepId}`;
  const jsonOutput = `${TMPDIR}/${id}.json`;

  fs.writeFileSync(
    jsonOutput,
    JSON.stringify({ data, error: error?.message }, typesHandler, 2)
  );

  const args = [selector, validateScriptPath, jsonOutput];
  const { stderr } = runCommandSync(`cue vet -d ${args.join(" ")}`, logger);

  if (fs.existsSync(jsonOutput)) {
    fs.unlinkSync(jsonOutput);
  }

  if (!stderr) {
    output.validation = { status: Status.SUCCEED };
  } else {
    process.exitCode = 1;
    output.validation = { status: Status.FAILED, error: stderr.stderr };
  }
}
