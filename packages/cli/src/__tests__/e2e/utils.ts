import {Status, ValidationResult, WorkflowOutput} from "../../lib";
import os from "os";
import path from "path";

export const clearStyle = (styled: string) => {
  return styled.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
};

export const parseOutput = (
  outputs: string
): Array<WorkflowOutput> => {
  const outputsArr = outputs.split(/-{35}[\t \n]+-{35}/);
  return outputsArr.map((output) => {
    output = output.replace(/-{35}/, "");
    const id = "ID: ";
    const status = "Job status: ";
    const data = "Data: ";
    const validation = "Validation status: ";
    const validationError = "Validation error: ";
    const error = "Error: ";
    const idIndex = output.indexOf(id);
    const statusIndex = output.indexOf(status);
    const dataIndex = output.indexOf(data);
    const validationIndex = output.indexOf(validation);
    const validationErrorIndex = output.indexOf(validationError);
    const errorIndex = output.indexOf(error);

    const result: Partial<WorkflowOutput> = {};

    result.id = output.substring(idIndex + id.length, statusIndex - 1).replace(/[\s-]+/g, "")

    const statusEndIndex = dataIndex !== -1 ? dataIndex - 1 : errorIndex - 1
    result.status = output.substring(statusIndex + status.length, statusEndIndex) as Status;

    const validationStatus = validationIndex !== -1 ?
      validationErrorIndex !== -1 ?
        output.substring(validationIndex + validation.length, validationErrorIndex).replace(/[\s-]+/g, "") :
        output.substring(validationIndex + validation.length).replace(/[\s-]+/g, "")
      : undefined

    const validationErrorMessage = validationErrorIndex !== -1 ?
      output.substring(validationErrorIndex + validationError.length).replace(/[\s-]+/g, "")
      : undefined
      if (validationStatus) {
        result.validation = { status: validationStatus } as ValidationResult
        if (validationErrorMessage) {
          result.validation.error = validationErrorMessage
        }
      }

    if (dataIndex !== -1) {
      const outputData =
        validationIndex !== -1
          ? output.substring(dataIndex + data.length, validationIndex - 1)
          : output.substring(dataIndex + data.length);
      result.data = JSON.parse(outputData);
    }
    if (errorIndex !== -1) {
        const message = errorIndex !== -1
          ? output.substring(errorIndex + error.length).replace(/[\s-]+/g, "")
          : undefined;
      result.error = new Error(message)
    }
    return result as WorkflowOutput;
  });
};

const getPlatformAndArch = (): string => {
  const supportedPlatforms: Record<string, string> = {
    darwin: "macos",
    win32: "win",
    linux: "linux",
  };
  const supportedArchitectures: Record<string, string> = {
    x64: "x64",
    arm64: "arm64",
  };

  const platform = supportedPlatforms[os.platform()];
  const arch = supportedArchitectures[os.arch()];

  if (!platform || !arch) {
    throw new Error(`Unsupported platform or architecture.
Supported platforms: ${Object.keys(supportedPlatforms).toString()}.
Supported architectures: ${Object.keys(supportedArchitectures).toString()}`);
  }

  if (platform === "win") {
    return `${platform}-${arch}.exe`;
  }
  return `${platform}-${arch}`;
};

const getCli = (): string => {
  if (process.env.PKG_CLI === "true") {
    const binPath = path.resolve(`${__dirname}/../../../standalone-binaries`);
    const platformArch = getPlatformAndArch();
    return `${binPath}/polywrap-${platformArch}`;
  }
  return `${__dirname}/../../../bin/polywrap`;
}

export const polywrapCli = getCli();
