export const clearStyle = (styled: string) => {
  return styled.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
};

export const parseOutput = (
  outputs: string
): Array<{
  id: string;
  data?: unknown;
  error?: unknown;
  validation?: string;
  status: string;
}> => {
  const outputsArr = outputs.split(/-{35}[\t \n]+-{35}/);
  return outputsArr.map((output) => {
    output = output.replace(/-{35}/, "");
    const idIdx = output.indexOf("ID: ");
    const statusIdx = output.indexOf("Status: ");
    const dataIdx = output.indexOf("Data: ");
    const validationIdx = output.indexOf("Validation: ");
    if (dataIdx !== -1) {
      const id = output.substring(idIdx + 3, statusIdx - 1);
      const status = output.substring(statusIdx + 8, dataIdx - 1);
      const data =
        validationIdx !== -1
          ? output.substring(dataIdx + 6, validationIdx - 1)
          : output.substring(dataIdx + 6);
      const validation =
        validationIdx !== -1
          ? output.substring(validationIdx + 12).replace(/\s/g, "")
          : undefined;

      return {
        id: id.replace(/\s/g, ""),
        status: status,
        data: JSON.parse(data),
        validation: validation,
      };
    } else {
      const errIdx = output.indexOf("Error: ");

      const id = output.substring(idIdx + 3, statusIdx - 1);
      const status = output.substring(statusIdx + 9, errIdx - 1);
      const error =
        validationIdx !== -1
          ? output.substring(errIdx + 6, validationIdx - 1)
          : output.substring(errIdx + 6);
      const validation =
        validationIdx !== -1
          ? output.substring(validationIdx + 12).replace(/\s/g, "")
          : undefined;

      return {
        id: id.replace(/\s/g, ""),
        status: status,
        error: JSON.parse(error),
        validation: validation,
      };
    }
  });
};

export const polywrapCli = `${__dirname}/../../../bin/polywrap`;
