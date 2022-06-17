export const clearStyle = (styled: string) => {
  return styled.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
};

export const parseOutput = (
  outputs: string
): Array<{ id: string; data?: unknown, error?: unknown }> => {
  const outputsArr = outputs.split(/-{35}[\t \n]+-{35}/);
  return outputsArr.map((output) => {
    output = output.replace(/-{35}/, "");
    const idIdx = output.indexOf("ID: ");
    const dataIdx = output.indexOf("Data: ");
    if (dataIdx !== -1) {
      const id = output.substring(idIdx + 3, dataIdx - 1);
      const data = output.substring(dataIdx + 6);
      return { id: id.replace(/\s/g, ""), data: JSON.parse(data) };
    } else {
      const errIdx = output.indexOf("Error: ");
      const id = output.substring(idIdx + 3);
      return { id: id.replace(/\s/g, ""), error: output.substring(errIdx + 7) };
    }
  });
};

export const polywrapCli = `${__dirname}/../../../bin/polywrap`;
