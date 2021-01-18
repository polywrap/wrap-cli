// Workaround for https://github.com/infinitered/gluegun/pull/464.
export const fixParameters = (
  parameters: { options: Record<string, unknown>; array?: string[] },
  booleanOptions: Record<string, unknown>
): string[] => {
  const unexpectedStringOptions = Object.keys(booleanOptions)
    .filter((key) => typeof booleanOptions[key] === "string")
    .map((key) => ({ key, value: booleanOptions[key] })) as {
    key: string;
    value: string;
  }[];

  const optionNames = unexpectedStringOptions
    .map(({ key }) => `--` + key.replace(/([A-Z])/, "-$1").toLowerCase())
    .join(", ");

  if (unexpectedStringOptions.length > 1) {
    throw new Error(
      `Unexpected value provided for one or more of ${optionNames}. See --help for more information.`
    );
  } else if (unexpectedStringOptions.length == 1) {
    const params = parameters.array || [];
    params.unshift(unexpectedStringOptions[0].value);
    return params;
  } else {
    return parameters.array || [];
  }
};
