export const clearStyle = (styled: string) => {
  return styled.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
};

export interface WorkflowOutput {
  id: string;
  data?: unknown;
  error?: unknown;
  validation?: string;
  status: string;
}

export const parseOutput = (
  outputs: string
): Array<WorkflowOutput> => {
  const outputsArr = outputs.split(/-{35}[\t \n]+-{35}/);
  return outputsArr.map((output) => {
    output = output.replace(/-{35}/, "");
    const idIdx = output.indexOf("ID: ");
    const statusIdx = output.indexOf("Status: ");
    const dataIdx = output.indexOf("Data: ");
    const validationIdx = output.indexOf("Validation: ");
    const errIdx = output.indexOf("Error: ");

    const result: Partial<WorkflowOutput> = {};

    result.id = output.substring(idIdx + 3, statusIdx - 1).replace(/[\s-]+/g, "")
    result.status = output.substring(statusIdx + 8, dataIdx - 1);
    result.validation =
      validationIdx !== -1
        ? errIdx !== -1
          ? output.substring(validationIdx + 12, errIdx).replace(/[\s-]+/g, "")
          : output.substring(validationIdx + 12).replace(/[\s-]+/g, "")
        : undefined;

    if (dataIdx !== -1) {
      const data =
        validationIdx !== -1
          ? output.substring(dataIdx + 6, validationIdx - 1)
          : output.substring(dataIdx + 6);
      result.data = JSON.parse(data);
    }
    if (errIdx !== -1) {
      result.error =
        errIdx !== -1
          ? output.substring(errIdx + 6).replace(/[\s-]+/g, "")
          : undefined;
    }
    return result as WorkflowOutput;
  });
};

export const polywrapCli = `${__dirname}/../../../bin/polywrap`;
