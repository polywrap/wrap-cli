import { intlMsg } from "../intl";
import { WorkflowOutput } from "./types";
import { typesHandler } from "../helpers";

import path from "path";
import fs from "fs";
import { WorkflowJobs } from "@polywrap/polywrap-manifest-types-js";

export const validateJobNames = (
  jobs: WorkflowJobs | undefined,
  idStack = ""
): void => {
  if (!jobs) return;
  for (const jobId of Object.keys(jobs)) {
    if (jobId === "data" || jobId === "error") {
      throw Error(
        `Reserved job name 'data' or 'error' found in job ${idStack}.${jobId}`
      );
    }
    validateJobNames(jobs[jobId].jobs, `${idStack}.${jobId}`);
  }
};

export function loadValidationScript(
  manifestPath: string,
  cueFilepath: string
): string {
  cueFilepath = path.join(path.join(manifestPath, ".."), cueFilepath);

  if (!fs.existsSync(cueFilepath)) {
    console.error(
      intlMsg.commands_test_error_validatorNotFound({
        path: cueFilepath,
      })
    );
    process.exit(1);
  }

  return cueFilepath;
}

export function printJobOutput(output: WorkflowOutput): void {
  console.log("-----------------------------------");
  console.log(`ID: ${output.id}`);
  console.log(`Job status: ${output.status}`);

  if (output.data !== undefined) {
    console.log(`Data: ${JSON.stringify(output.data, typesHandler, 2)}`);
  }

  if (output.error) {
    console.log(`Error: ${output.error.message}`);
  }

  console.log(`Validation status: ${output.validation.status}`);
  if (output.validation.error !== undefined) {
    console.log(`Validation error: ${parseCmdError(output.validation.error)}`);
  }
  console.log("-----------------------------------");
}

const parseCmdError = (error: string) => {
  const msgLines = error.split(/\r?\n/);
  msgLines[1] = `${msgLines[1].split(":").slice(1).join(":")}`;
  return msgLines.slice(0, 2).join("\n");
};
